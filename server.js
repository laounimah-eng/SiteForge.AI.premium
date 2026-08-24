const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

const SYSTEM = `You are SiteForge AI, a senior website architect, conversion designer, accessibility-minded frontend engineer and copywriter.

Build premium, production-minded websites from natural language.

NON-NEGOTIABLE RULES:
- Return ONLY one complete HTML document when generating or editing a website.
- Use semantic accessible HTML with a valid viewport and responsive desktop/tablet/mobile layouts.
- Inline CSS and JS; do not require a frontend framework.
- Never use Lorem Ipsum.
- NEVER invent real-world business facts, phone numbers, addresses, licenses, revenue, client counts, awards, credentials, ratings or testimonials. If missing, use clearly marked placeholders such as [COMPANY PHONE], [COMPANY ADDRESS] or “Sample testimonial”.
- Do not present demo content as verified fact.
- Do not claim backend, payment, CRM, authentication, CMS, analytics, email delivery or form submission exists unless the implementation actually provides it.
- Forms must be honest: if there is no backend, use a clear demo-success interaction and label it appropriately.
- Use accessible labels, visible focus states, sensible heading order, sufficient contrast and keyboard-friendly controls.
- Include clear primary and secondary CTAs where appropriate.
- Keep typography readable: body text roughly 16px, normal UI text 13–15px, headings proportionate and never cramped.
- Avoid excessive gradients, huge text, tiny text, visual clutter and generic AI-template styling.
- Use cohesive design tokens, consistent spacing and premium visual hierarchy.
- External stock images may be used when useful, but do not invent ownership or authenticity claims.
- Prefer a strong, useful structure over decorative excess.`;

function cleanHtml(text='') {
  return String(text).replace(/^```html\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim();
}
function stripJson(text='') {
  return String(text).replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim();
}
function key(){ if(!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY is not configured in Railway Variables.'); return process.env.OPENROUTER_API_KEY; }

async function callAI(messages, opts={}) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:'POST',
    headers:{
      Authorization:`Bearer ${key()}`,
      'Content-Type':'application/json',
      'HTTP-Referer':process.env.SITEFORGE_PUBLIC_URL || 'https://siteforge-ai.app',
      'X-Title':'SiteForge AI'
    },
    body:JSON.stringify({
      model:process.env.OPENROUTER_MODEL || 'openrouter/free',
      messages,
      temperature:opts.temperature ?? 0.65,
      max_tokens:opts.max_tokens ?? 18000
    })
  });
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message || 'OpenRouter request failed.');
  return data?.choices?.[0]?.message?.content || '';
}

app.get('/api/health',(req,res)=>res.json({ok:true,product:'SiteForge AI',version:'4.0.0',aiConfigured:Boolean(process.env.OPENROUTER_API_KEY)}));

app.post('/api/generate', async (req,res)=>{
  try{
    const {prompt='',currentHtml='',instruction='',mode='generate'}=req.body||{};
    let user;
    if(mode==='edit') user=`CURRENT WEBSITE:\n${currentHtml}\n\nUSER CHANGE REQUEST:\n${instruction}\n\nApply the requested change while preserving the strongest existing structure. Return the COMPLETE updated HTML only.`;
    else user=`Create a complete, polished website for this brief:\n${prompt}\n\nMake intelligent decisions about information architecture, copy, conversion, responsive behavior, interactions and visual system. Use placeholders for missing business facts. Return the complete HTML only.`;
    const out=await callAI([{role:'system',content:SYSTEM},{role:'user',content:user}],{temperature:0.7,max_tokens:20000});
    const html=cleanHtml(out);
    if(!html.toLowerCase().includes('<html')) throw new Error('The AI returned an invalid website. Please try again.');
    res.json({ok:true,html});
  }catch(e){res.status(500).json({ok:false,error:e.message||'Generation failed.'});}
});

app.post('/api/quality-check', async (req,res)=>{
  try{
    const html=String(req.body?.html||'');
    if(!html) return res.status(400).json({ok:false,error:'No website HTML provided.'});
    const local=[];
    if(!/<meta[^>]+name=["']viewport/i.test(html)) local.push('Missing responsive viewport metadata.');
    if(!/<title>/i.test(html)) local.push('Missing page title.');
    if(/lorem ipsum/i.test(html)) local.push('Lorem Ipsum placeholder text detected.');
    if(/\b\d{3,}\+?\s*(clients|customers|properties|years|sales)/i.test(html)) local.push('Review business metrics for unsupported claims.');
    const raw=await callAI([{role:'system',content:'You are a strict production website auditor. Return JSON only with keys score, issues, fixes, seo, accessibility, performance. Do not invent facts.'},{role:'user',content:`Audit this website:\n${html}`}],{temperature:0.2,max_tokens:3500});
    let result; try{result=JSON.parse(stripJson(raw));}catch{result={score:60,issues:['AI audit returned invalid JSON.'],fixes:[],seo:[],accessibility:[],performance:[]};}
    result.issues=[...new Set([...(result.issues||[]),...local])];
    result.score=Math.max(0,Math.min(100,Number(result.score)||60));
    res.json({ok:true,result});
  }catch(e){res.status(500).json({ok:false,error:e.message||'Quality check failed.'});}
});

app.post('/api/seo', async (req,res)=>{
  try{
    const html=String(req.body?.html||'');
    const raw=await callAI([{role:'system',content:'You are an SEO specialist. Return ONLY valid JSON with keys: title, description, keywords (array), ogTitle, ogDescription, recommendations (array). Never invent business facts.'},{role:'user',content:`Analyze this website and produce practical SEO metadata:\n${html}`}],{temperature:0.2,max_tokens:2500});
    res.json({ok:true,result:JSON.parse(stripJson(raw))});
  }catch(e){res.status(500).json({ok:false,error:e.message||'SEO optimization failed.'});}
});

app.post('/api/ideas', async (req,res)=>{
  try{
    const niche=String(req.body?.niche||'website');
    const raw=await callAI([{role:'system',content:'You generate concise website strategy ideas. Return JSON only: {"ideas":[{"title":"","prompt":"","angle":""}]} with 5 ideas. Never invent facts.'},{role:'user',content:`Give 5 strong website concepts for: ${niche}`}],{temperature:0.75,max_tokens:2200});
    res.json({ok:true,result:JSON.parse(stripJson(raw))});
  }catch(e){res.status(500).json({ok:false,error:e.message||'Idea generation failed.'});}
});

app.use((req,res,next)=>{ if(req.method==='GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(__dirname,'public','index.html')); next(); });
app.use((req,res)=>res.status(404).json({error:'Route not found.'}));

app.listen(PORT,'0.0.0.0',()=>console.log(`SiteForge AI running on port ${PORT}`));
