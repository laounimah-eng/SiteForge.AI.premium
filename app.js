const state = {
  html: "",
  projectName: "Untitled Website",
  history: JSON.parse(localStorage.getItem("siteforge-history") || "[]"),
  projects: JSON.parse(localStorage.getItem("siteforge-projects") || "[]")
};

const $ = id => document.getElementById(id);
const brief = $("briefInput");
const preview = $("sitePreview");
const stage = $("previewStage");

function toast(msg) {
  const el = $("toast"); el.textContent = msg; el.classList.add("show");
  clearTimeout(window.__toast); window.__toast = setTimeout(() => el.classList.remove("show"), 2600);
}
function addActivity(title, detail="") {
  const list = $("activityList");
  if (list.querySelector(".muted")) list.innerHTML = "";
  const row = document.createElement("div"); row.className = "activity";
  row.innerHTML = `<strong>${escapeHtml(title)}</strong>${detail ? `<br><span>${escapeHtml(detail)}</span>` : ""}`;
  list.prepend(row);
  state.history.unshift({title, detail, time: Date.now()});
  state.history = state.history.slice(0, 12);
  localStorage.setItem("siteforge-history", JSON.stringify(state.history));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function setLoading(on) {
  $("generateBtn").disabled = on;
  $("generateBtn").innerHTML = on ? "✦ Forging your website…" : "<span>✦</span> Generate Website <b>⌘↵</b>";
  $("previewStage").classList.toggle("loading", on);
}
function setSite(html, meta={}) {
  state.html = html;
  $("emptyPreview").style.display = "none";
  stage.classList.add("has-site");
  preview.srcdoc = html;
  if(meta.projectName) {
    state.projectName = meta.projectName;
    $("projectName").textContent = meta.projectName;
  }
  $("pageCount").textContent = `${meta.pages || countPages(html)} pages`;
  $("previewLabel").textContent = "Live generated website";
  updateQuality(meta.quality || scoreLocal(html));
}
function countPages(html){ const m = html.match(/data-page=/g); return Math.max(1, m ? m.length : 1); }
function scoreLocal(html) {
  const checks = {
    responsive: /@media|viewport/i.test(html),
    cta: /call|contact|book|start|buy|shop|demo|get started|learn more/i.test(html),
    copy: html.length > 3000 && !/lorem ipsum/i.test(html),
    hierarchy: /<h1[\s>]|<h2[\s>]/i.test(html)
  };
  return {score: Math.round(Object.values(checks).filter(Boolean).length / 4 * 100), checks};
}
function updateQuality(q) {
  const score = Math.max(0, Math.min(100, Number(q.score ?? 0)));
  $("qualityScore").textContent = `${score}/100`;
  $("qualityMini").textContent = `Quality ${score}`;
  $("scoreRingText").textContent = score;
  $("scoreCircle").style.strokeDashoffset = String(106.8 - (106.8 * score / 100));
  const labels = [
    ["responsive", "responsiveCheck", "responsiveIcon"],
    ["cta", "ctaCheck", "ctaIcon"],
    ["copy", "copyCheck", "copyIcon"],
    ["hierarchy", "hierarchyCheck", "hierarchyIcon"]
  ];
  labels.forEach(([key, txt, icon]) => {
    const ok = !!q.checks?.[key];
    $(txt).textContent = ok ? "Looks good" : "Needs attention";
    $(icon).textContent = ok ? "✓" : "!";
    $(icon).parentElement.classList.toggle("ok", ok);
  });
}
async function callAI(action, payload) {
  const response = await fetch("/api/generate", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({action, ...payload})
  });
  const data = await response.json();
  if(!response.ok) throw new Error(data.error || "AI request failed");
  return data;
}
async function generateWebsite() {
  const prompt = brief.value.trim();
  if(!prompt){ toast("Describe the website you want first."); brief.focus(); return; }
  setLoading(true);
  try {
    const data = await callAI("generate", {prompt});
    setSite(data.html, data.meta);
    addActivity("Website generated", `${data.meta?.pages || countPages(data.html)} pages · ${data.meta?.score || scoreLocal(data.html).score}/100 quality`);
    saveProject();
    toast("Website forged successfully.");
  } catch(e) {
    toast(e.message);
  } finally { setLoading(false); }
}
async function editWebsite() {
  const instruction = $("editInput").value.trim();
  if(!instruction){ toast("Tell SiteForge what you want changed."); return; }
  if(!state.html){ toast("Generate a website first."); return; }
  $("editBtn").disabled = true; $("editBtn").textContent = "Applying…";
  try {
    const data = await callAI("edit", {html: state.html, instruction});
    setSite(data.html, data.meta);
    addActivity("Website updated", instruction);
    saveProject();
    $("editInput").value = "";
    toast("Change applied without rebuilding your site from scratch.");
  } catch(e){ toast(e.message); }
  finally { $("editBtn").disabled = false; $("editBtn").innerHTML = "Apply change <span>↗</span>"; }
}
function saveProject(){
  if(!state.html) return;
  const project = {id: Date.now(), name: state.projectName, html: state.html, brief: brief.value, updated: new Date().toISOString()};
  state.projects = state.projects.filter(p=>p.name!==state.projectName);
  state.projects.unshift(project); state.projects = state.projects.slice(0,20);
  localStorage.setItem("siteforge-projects", JSON.stringify(state.projects));
}
function downloadHTML(){
  if(!state.html){toast("Generate a website before exporting.");return;}
  const blob = new Blob([state.html], {type:"text/html;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=(state.projectName||"siteforge-website").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".html"; a.click(); URL.revokeObjectURL(a.href);
  addActivity("Exported HTML","Standalone website downloaded.");
  toast("Standalone HTML exported.");
}
$("generateBtn").onclick = generateWebsite;
$("editBtn").onclick = editWebsite;
$("exportBtn").onclick = downloadHTML;
$("refreshPreview").onclick = () => { if(state.html) preview.srcdoc = state.html; };
$("openPreview").onclick = () => { if(state.html) window.open(URL.createObjectURL(new Blob([state.html],{type:"text/html"})),"_blank"); };
$("clearActivity").onclick = () => { $("activityList").innerHTML = '<div class="activity muted">Your generation history will appear here.</div>'; state.history=[]; localStorage.removeItem("siteforge-history"); };
$("newProjectBtn").onclick = () => { state.html=""; brief.value=""; $("projectName").textContent="Untitled Website"; $("pageCount").textContent="0 pages"; $("qualityMini").textContent="Quality —"; stage.classList.remove("has-site"); $("emptyPreview").style.display="block"; preview.srcdoc=""; updateQuality({score:0,checks:{}}); toast("New website workspace ready."); };
brief.addEventListener("keydown", e => { if((e.metaKey||e.ctrlKey)&&e.key==="Enter") generateWebsite(); });
$("editInput").addEventListener("keydown", e => { if((e.metaKey||e.ctrlKey)&&e.key==="Enter") editWebsite(); });
document.querySelectorAll(".prompt-chip").forEach(b=>b.onclick=()=>{brief.value=b.dataset.prompt;brief.focus();});
document.querySelectorAll(".device").forEach(b=>b.onclick=()=>{document.querySelectorAll(".device").forEach(x=>x.classList.remove("active"));b.classList.add("active");stage.classList.remove("tablet","mobile");if(b.dataset.device!=="desktop")stage.classList.add(b.dataset.device);});
window.addEventListener("beforeunload", saveProject);
