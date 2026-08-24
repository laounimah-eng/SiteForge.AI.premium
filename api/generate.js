export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

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

Your job is to create premium, production-minded websites from natural language.

IMPORTANT RULES:
- Return ONLY one complete HTML document.
- Do not use Markdown code fences.
- Do not explain the code.
- Use semantic HTML.
- Use responsive CSS for desktop, tablet, and mobile.
- Use inline CSS and inline JavaScript.
- Do not depend on external libraries.
- Never use Lorem Ipsum.
- Write realistic, relevant website copy.
- Create strong visual hierarchy.
- Create professional navigation, sections, buttons, cards, forms and CTAs.
- Choose the colors, layout, typography and sections intelligently.
- Make the website match the user's requested industry and style.
- Add tasteful animations and interactions when useful.
- Do not claim to have implemented databases, payments, authentication,
  CMS, analytics, or backend features unless they actually exist.
- The final result must be a complete standalone HTML website.
`;

    let userPrompt;

    if (mode === "edit") {
      userPrompt = `
Here is the current website:

${currentHtml}

The user wants this change:

${instruction}

Modify the existing website while preserving all good existing work.

Return the COMPLETE updated HTML document only.
`;
    } else {
      userPrompt = `
Create a complete website from this request:

${prompt}

You must make the design decisions yourself.

Determine:
- Website structure
- Sections
- Navigation
- Visual style
- Colors
- Typography
- CTA strategy
- Responsive behavior
- Copywriting
- Front-end interactions

Return the COMPLETE finished HTML document only.
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
          model:
            process.env.OPENROUTER_MODEL || "openrouter/free",

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

    let html =
      data?.choices?.[0]?.message?.content || "";

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
        error:
          "The AI returned an invalid website document."
      });
    }

    return res.status(200).json({
      html
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        error?.message ||
        "Internal server error."
    });
  }
}
