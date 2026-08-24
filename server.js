import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

app.post("/api/generate", async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY is not configured."
    });
  }

  try {
    const {
      prompt = "",
      currentHtml = "",
      instruction = "",
      mode = "generate"
    } = req.body || {};

    const systemPrompt = `
You are SiteForge AI, an expert website architect, UI/UX designer,
frontend engineer, conversion copywriter, and brand designer.

Your job is to create premium, polished websites from natural language.

Return ONLY one complete HTML document.
Do not use Markdown code fences.
Do not explain the code.

Rules:
- Use semantic HTML.
- Use responsive CSS for desktop, tablet and mobile.
- Use inline CSS and inline JavaScript.
- Do not require external libraries.
- Never use Lorem Ipsum.
- Write realistic, relevant website copy.
- Create strong visual hierarchy.
- Create professional navigation, sections, buttons, cards, forms and CTAs.
- Make the website match the user's requested industry and style.
- Add tasteful animations and interactions when useful.
- Do not claim that databases, payments, authentication,
  CMS, analytics, or backend systems exist unless they actually exist.
- Return a complete standalone HTML website.
`;

    let userPrompt;

    if (mode === "edit") {
      userPrompt = `
Here is the current website:

${currentHtml}

The user wants this change:

${instruction}

Preserve the existing quality and structure where possible.
Return the COMPLETE updated HTML document only.
`;
    } else {
      userPrompt = `
Create a complete website from this request:

${prompt}

Make all design decisions intelligently:
- Structure
- Sections
- Navigation
- Colors
- Typography
- Layout
- CTA strategy
- Copywriting
- Responsive behavior
- Front-end interactions

Return the COMPLETE website HTML only.
`;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://siteforge-ai.app",
          "X-Title": "SiteForge AI"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 14000
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenRouter request failed."
      });
    }

    let html = data?.choices?.[0]?.message?.content || "";

    html = html
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    if (
      !html.toLowerCase().startsWith("<!doctype html") &&
      !html.toLowerCase().startsWith("<html")
    ) {
      return res.status(500).json({
        error: "The AI returned an invalid website document."
      });
    }

    return res.status(200).json({ html });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Internal server error."
    });
  }
});

/*
  Serve the SiteForge interface for normal browser pages.
  No wildcard route is used, so this is compatible with Express 5.
*/
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "index.html"));
  }

  next();
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SiteForge AI running on port ${PORT}`);
});
