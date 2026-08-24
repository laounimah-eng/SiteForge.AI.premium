const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '8mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

/* =========================================================
   SITEFORGE AI — GENERATION ENGINE 5.0
   Understand → Plan → Build → Validate → Repair
   ========================================================= */

const VERSION = '5.0.0';

const CORE_RULES = `
You are SiteForge AI 5.0 — an elite autonomous website architect,
UX/UI designer, conversion strategist, frontend engineer,
accessibility specialist and visual art director.

Your job is NOT to blindly follow a generic website template.

You must understand what the user actually wants and intelligently
build the right type of website.

A request may describe ANYTHING:
restaurant, ecommerce store, SaaS, startup, agency, portfolio,
real estate, hotel, travel, education, course, event, magazine,
fashion, beauty, fitness, healthcare, finance, technology,
personal brand, booking service, marketplace, landing page,
dashboard, directory, community, creative studio, or an unusual
custom concept.

You must infer the appropriate information architecture,
visual language, content structure, components, interactions,
conversion flow and responsive behavior from the user's request.

CORE PRINCIPLES:

1. Understand the business/use case before designing.
2. Never force every request into the same template.
3. Choose sections based on the requested website type.
4. If the user requests products, create product cards.
5. If the user requests prices, display prices clearly.
6. If the user requests images, use relevant images.
7. If the user requests ordering, create an order/cart experience.
8. If the user requests booking, create a booking interface.
9. If the user requests search/filtering, implement it.
10. If the user requests forms, implement useful front-end interactions.
11. If a backend is not actually connected, clearly label the interaction
    as demo mode instead of pretending it is real.
12. Never invent real company facts, addresses, phone numbers,
    awards, certifications, revenue, customers or testimonials.
13. Use placeholders for unknown real-world information.
14. Never use Lorem Ipsum.
15. Never use random placeholder images such as Picsum.
16. Never use an unrelated image for a requested subject.
17. Images must visually match their alt text and surrounding content.
18. Use image URLs from the provided image library whenever possible.
19. Use semantic HTML.
20. Include responsive desktop, tablet and mobile layouts.
21. Include accessible labels, focus states and keyboard-friendly controls.
22. Use readable typography, approximately 16px body text.
23. Avoid giant unreadable headlines.
24. Avoid excessive gradients and generic AI-template aesthetics.
25. Use a coherent design system with reusable CSS variables.
26. Use meaningful micro-interactions and hover states.
27. Make the website look intentionally designed, not randomly generated.
28. Every major CTA must have a clear purpose.
29. Navigation must match the site's actual sections.
30. The final result must be complete and previewable as one HTML document.

IMPORTANT IMAGE RULE:

Do NOT use:
- Picsum
- random placeholder images
- broken image URLs
- unrelated stock photos
- empty image boxes pretending to be photography

Prefer the supplied relevant image library.

If an exact image is not available, use the closest semantically relevant
image from the library and make the visual context clear.

Do not claim an image is an official company/product photograph unless
the user provided that information.

IMPORTANT FUNCTIONALITY RULE:

Generated websites may contain front-end interactions such as:
- navigation
- tabs
- filters
- search
- cart
- quantity controls
- calculators
- accordions
- modals
- pricing toggles
- booking forms
- demo checkout
- contact forms
- newsletter forms
- sliders
- galleries

These should actually work with vanilla JavaScript whenever practical.

Never claim that an email was actually sent, an order was actually
processed, payment was actually charged, or a booking was actually
confirmed unless a real backend exists.

Return ONLY the complete HTML document when asked to generate a website.
`;

/* =========================================================
   RELEVANT IMAGE LIBRARY
   Stable Unsplash images grouped by subject.
   The AI is instructed to choose semantically relevant images.
   ========================================================= */

const IMAGE_LIBRARY = {
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85'
  ],

  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85'
  ],

  pizza: [
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85'
  ],

  coffee: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85'
  ],

  restaurant: [
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=85'
  ],

  fashion: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=85'
  ],

  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85'
  ],

  beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85'
  ],

  skincare: [
    'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1400&q=85'
  ],

  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85'
  ],

  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=85'
  ],

  office: [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85'
  ],

  business: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85'
  ],

  realestate: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85'
  ],

  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85'
  ],

  travel: [
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85'
  ],

  nature: [
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85'
  ],

  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85'
  ],

  education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85'
  ],

  event: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85'
  ],

  photography: [
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=85'
  ],

  nature_product: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85'
  ]
};

function imageLibraryText() {
  return Object.entries(IMAGE_LIBRARY)
    .map(([category, urls]) => {
      return `${category.toUpperCase()}:\n${urls.join('\n')}`;
    })
    .join('\n\n');
}

/* =========================================================
   HELPERS
   ========================================================= */

function cleanHtml(text = '') {
  return String(text)
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function stripJson(text = '') {
  return String(text)
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function extractJson(text = '') {
  const cleaned = stripJson(text);

  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start >= 0 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (_) {}
  }

  throw new Error('AI returned invalid JSON.');
}

function key() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      'OPENROUTER_API_KEY is not configured in Railway Variables.'
    );
  }

  return process.env.OPENROUTER_API_KEY;
}

function model() {
  return process.env.OPENROUTER_MODEL || 'openrouter/free';
}

function clip(text, max = 70000) {
  const value = String(text || '');

  if (value.length <= max) return value;

  return value.slice(0, max) +
    '\n\n<!-- Content clipped internally for the AI validation pass. -->';
}

/* =========================================================
   OPENROUTER
   ========================================================= */

async function callAI(messages, opts = {}) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.AI_TIMEOUT_MS || 240000)
  );

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${key()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer':
            process.env.SITEFORGE_PUBLIC_URL ||
            'https://siteforge-ai.app',
          'X-Title': 'SiteForge AI'
        },
        body: JSON.stringify({
          model: opts.model || model(),
          messages,
          temperature:
            opts.temperature !== undefined
              ? opts.temperature
              : 0.55,
          max_tokens: opts.max_tokens || 18000
        })
      }
    );

    const raw = await response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch (_) {
      throw new Error('OpenRouter returned an invalid response.');
    }

    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
        `OpenRouter request failed (${response.status}).`
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI returned an empty response.');
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/* =========================================================
   STAGE 1 — UNDERSTAND + PLAN
   ========================================================= */

async function createPlan(prompt) {
  const plannerSystem = `
${CORE_RULES}

You are now the SITEFORGE PLANNING ARCHITECT.

Do not generate HTML.

Analyze the user's request and produce a practical website blueprint.

Return ONLY valid JSON using exactly this structure:

{
  "siteType": "",
  "audience": "",
  "primaryGoal": "",
  "secondaryGoals": [],
  "visualDirection": {
    "mood": "",
    "palette": [],
    "typography": "",
    "layout": ""
  },
  "requiredSections": [],
  "requiredFeatures": [],
  "contentNeeds": [],
  "imageCategories": [],
  "interactiveFeatures": [],
  "conversionFlow": [],
  "responsiveRequirements": [],
  "specialInstructions": []
}

Be decisive.

If the user asks for a restaurant:
include menu, food imagery, pricing and ordering where appropriate.

If the user asks for ecommerce:
include products, product imagery, pricing, filters, cart and checkout/demo checkout.

If the user asks for SaaS:
include product explanation, benefits, features, pricing, CTA, FAQ and conversion flow.

If the user asks for real estate:
include property cards, imagery, price, filters, details and inquiry flow.

If the user asks for a portfolio:
include projects, visuals, case studies and contact.

Do not blindly add every possible section.
Select what makes sense for the specific request.
`;

  const raw = await callAI(
    [
      {
        role: 'system',
        content: plannerSystem
      },
      {
        role: 'user',
        content: `USER WEBSITE REQUEST:\n${prompt}`
      }
    ],
    {
      temperature: 0.25,
      max_tokens: 4500
    }
  );

  return extractJson(raw);
}

/* =========================================================
   STAGE 2 — BUILD
   ========================================================= */

async function generateWebsite(prompt, plan) {
  const builderSystem = `
${CORE_RULES}

You are now the SITEFORGE BUILD ENGINE.

Build the complete website from the user's request and the approved plan.

APPROVED WEBSITE PLAN:
${JSON.stringify(plan, null, 2)}

IMAGE LIBRARY:
${imageLibraryText()}

IMAGE IMPLEMENTATION:

Choose images according to semantic relevance.

For example:
- burger → BURGER image
- pizza → PIZZA image
- restaurant → RESTAURANT image
- real estate → REALESTATE images
- shoes → SHOES image
- fashion → FASHION images
- coffee → COFFEE image
- hotel → HOTEL image
- fitness → FITNESS image
- technology → TECHNOLOGY image

Do NOT use Picsum.

Do NOT write fake URLs.

Use the supplied image URLs exactly when appropriate.

If multiple cards need different images but only one relevant URL exists,
it is acceptable to reuse it rather than invent a broken URL.

FUNCTIONALITY:

Implement useful front-end interactions in vanilla JavaScript.

Examples:

Restaurant:
- category filtering
- add to order
- cart
- quantity controls
- subtotal/total
- checkout/demo order

Ecommerce:
- search
- category filter
- product cards
- cart
- quantity
- totals
- demo checkout

Real estate:
- property filters
- search
- property cards
- details modal
- inquiry form

SaaS:
- pricing toggle if useful
- FAQ accordion
- navigation
- CTA interactions

Booking:
- date selector
- time selector
- guest selector
- demo confirmation

Forms:
- validate required fields
- show honest demo success message

IMPORTANT:

Do not create fake backend functionality.

If backend functionality is not available, say "Demo mode" inside the
interaction rather than pretending an external request was processed.

VISUAL STANDARD:

The result should look like a premium agency-built website.

Use:
- strong visual hierarchy
- excellent spacing
- polished navigation
- tasteful animations
- premium cards
- clear CTAs
- responsive grids
- proper image cropping
- accessible controls
- subtle shadows
- coherent color tokens
- professional typography

Do not overdecorate.

Do not make every section look identical.

Do not use giant empty spaces simply to make the page longer.

The generated page must be self-contained:
HTML + CSS + JS in one document.

Return ONLY the complete HTML document.
`;

  const userMessage = `
USER REQUEST:
${prompt}

BUILD THE WEBSITE ACCORDING TO THIS REQUEST AND THE APPROVED PLAN.

The user's intent is more important than generic template habits.
Make the requested subject visually obvious immediately.

If the user asked for products, show products.

If the user asked for food, show food.

If the user asked for properties, show properties.

If the user asked for projects, show projects.

If the user asked for services, show services.

If the user asked for a specific feature, actually implement it when
possible in the generated front-end.
`;

  const raw = await callAI(
    [
      {
        role: 'system',
        content: builderSystem
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    {
      temperature: 0.65,
      max_tokens: 20000
    }
  );

  return cleanHtml(raw);
}

/* =========================================================
   LOCAL WEBSITE VALIDATOR
   ========================================================= */

function validateLocal(html) {
  const issues = [];

  if (!/<html[\s>]/i.test(html)) {
    issues.push('Missing <html> document.');
  }

  if (!/<head[\s>]/i.test(html)) {
    issues.push('Missing <head>.');
  }

  if (!/<body[\s>]/i.test(html)) {
    issues.push('Missing <body>.');
  }

  if (!/<meta[^>]+viewport/i.test(html)) {
    issues.push('Missing responsive viewport.');
  }

  if (!/<title>/i.test(html)) {
    issues.push('Missing page title.');
  }

  if (/lorem ipsum/i.test(html)) {
    issues.push('Lorem Ipsum detected.');
  }

  if (/picsum\.photos/i.test(html)) {
    issues.push('Picsum placeholder image detected.');
  }

  if (/via\.placeholder\.com/i.test(html)) {
    issues.push('Placeholder image detected.');
  }

  if (/<img\b/i.test(html) && !/alt\s*=/i.test(html)) {
    issues.push('Images may be missing alt text.');
  }

  const openScripts =
    (html.match(/<script\b/gi) || []).length;

  const closeScripts =
    (html.match(/<\/script>/gi) || []).length;

  if (openScripts !== closeScripts) {
    issues.push('Unbalanced script tags.');
  }

  const openDivs =
    (html.match(/<div\b/gi) || []).length;

  const closeDivs =
    (html.match(/<\/div>/gi) || []).length;

  if (Math.abs(openDivs - closeDivs) > 3) {
    issues.push('Possible unbalanced div structure.');
  }

  return [...new Set(issues)];
}

/* =========================================================
   STAGE 3 — AUTO REPAIR
   ========================================================= */

async function repairWebsite(html, originalPrompt, plan, issues) {
  if (!issues.length) {
    return html;
  }

  const repairSystem = `
${CORE_RULES}

You are the SITEFORGE FINAL REPAIR ENGINE.

You are given a generated website that has already been designed.

Do NOT redesign it unnecessarily.

Fix the identified problems while preserving:
- the visual identity
- the requested subject
- the sections
- the content
- the interactions
- the relevant imagery
- the responsive behavior

CRITICAL:
If an image uses Picsum or an unrelated placeholder, replace it with
the closest relevant image from this library:

${imageLibraryText()}

Return ONLY the complete corrected HTML document.
`;

  const raw = await callAI(
    [
      {
        role: 'system',
        content: repairSystem
      },
      {
        role: 'user',
        content: `
ORIGINAL REQUEST:
${originalPrompt}

PLAN:
${JSON.stringify(plan, null, 2)}

VALIDATION ISSUES:
${issues.map(x => `- ${x}`).join('\n')}

CURRENT WEBSITE:
${clip(html)}
`
      }
    ],
    {
      temperature: 0.25,
      max_tokens: 20000
    }
  );

  const repaired = cleanHtml(raw);

  if (!repaired.toLowerCase().includes('<html')) {
    return html;
  }

  return repaired;
}

/* =========================================================
   MAIN GENERATION PIPELINE
   ========================================================= */

async function forgeWebsite(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error('Describe the website you want to build.');
  }

  /* 1 — Understand */
  let plan;

  try {
    plan = await createPlan(prompt);
  } catch (error) {
    plan = {
      siteType: 'custom website',
      audience: 'website visitors',
      primaryGoal: 'Present the requested concept clearly',
      secondaryGoals: [],
      visualDirection: {
        mood: 'premium',
        palette: [],
        typography: 'modern',
        layout: 'responsive'
      },
      requiredSections: [
        'hero',
        'main content',
        'about',
        'contact',
        'footer'
      ],
      requiredFeatures: [],
      contentNeeds: [],
      imageCategories: ['business'],
      interactiveFeatures: ['navigation'],
      conversionFlow: ['hero CTA'],
      responsiveRequirements: [
        'desktop',
        'tablet',
        'mobile'
      ],
      specialInstructions: [
        'Follow the user's request precisely.'
      ]
    };
  }

  /* 2 — Build */
  let html = await generateWebsite(prompt, plan);

  if (!html || !html.toLowerCase().includes('<html')) {
    throw new Error(
      'The AI returned an invalid website. Please try again.'
    );
  }

  /* 3 — Local validation */
  const issues = validateLocal(html);

  /* 4 — Repair only when needed */
  if (issues.length) {
    try {
      html = await repairWebsite(
        html,
        prompt,
        plan,
        issues
      );
    } catch (error) {
      console.warn(
        'Auto-repair failed:',
        error.message
      );
    }
  }

  return {
    html,
    plan,
    issues
  };
}

/* =========================================================
   HEALTH
   ========================================================= */

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    product: 'SiteForge AI',
    version: VERSION,
    aiConfigured: Boolean(
      process.env.OPENROUTER_API_KEY
    ),
    model: model(),
    pipeline: [
      'understand',
      'plan',
      'generate',
      'validate',
      'auto-repair'
    ]
  });
});

/* =========================================================
   GENERATE
   ========================================================= */

app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt = '',
      currentHtml = '',
      instruction = '',
      mode = 'generate'
    } = req.body || {};

    /* ---------------- EDIT MODE ---------------- */

    if (mode === 'edit') {
      if (!currentHtml) {
        return res.status(400).json({
          ok: false,
          error: 'No current website provided.'
        });
      }

      if (!instruction.trim()) {
        return res.status(400).json({
          ok: false,
          error: 'Tell SiteForge what you want to change.'
        });
      }

      const editSystem = `
${CORE_RULES}

You are the SITEFORGE EDIT ENGINE.

The user already has a website.

Modify the existing website according to the user's instruction.

Do NOT rebuild unrelated sections.

Preserve strong existing design decisions.

If the user asks to add a feature, actually implement it.

If the user asks to change images, use relevant images from this library:

${imageLibraryText()}

Return ONLY the complete updated HTML document.
`;

      const raw = await callAI(
        [
          {
            role: 'system',
            content: editSystem
          },
          {
            role: 'user',
            content: `
CURRENT WEBSITE:
${clip(currentHtml)}

USER CHANGE REQUEST:
${instruction}

Apply the requested change precisely.
`
          }
        ],
        {
          temperature: 0.45,
          max_tokens: 20000
        }
      );

      let html = cleanHtml(raw);

      if (!html.toLowerCase().includes('<html')) {
        throw new Error(
          'The AI returned an invalid edited website.'
        );
      }

      const issues = validateLocal(html);

      if (issues.length) {
        try {
          html = await repairWebsite(
            html,
            instruction,
            {},
            issues
          );
        } catch (_) {}
      }

      return res.json({
        ok: true,
        html
      });
    }

    /* ---------------- GENERATE MODE ---------------- */

    const result = await forgeWebsite(prompt);

    res.json({
      ok: true,
      html: result.html,
      plan: result.plan,
      validation: result.issues
    });

  } catch (error) {
    console.error(
      'Generation error:',
      error
    );

    res.status(500).json({
      ok: false,
      error:
        error?.name === 'AbortError'
          ? 'AI request timed out. Please try again.'
          : error.message ||
            'Website generation failed.'
    });
  }
});

/* =========================================================
   QUALITY CHECK
   ========================================================= */

app.post('/api/quality-check', async (req, res) => {
  try {
    const html = String(
      req.body?.html || ''
    );

    if (!html) {
      return res.status(400).json({
        ok: false,
        error: 'No website HTML provided.'
      });
    }

    const localIssues =
      validateLocal(html);

    const auditSystem = `
You are SiteForge AI's strict production auditor.

Audit the supplied website.

Return ONLY valid JSON:

{
  "score": 0,
  "issues": [],
  "fixes": [],
  "seo": [],
  "accessibility": [],
  "performance": [],
  "ux": [],
  "conversion": [],
  "imagery": []
}

Be practical.

Check:
- responsive design
- visual hierarchy
- navigation
- typography
- accessibility
- image relevance
- broken/placeholder images
- CTA clarity
- forms
- mobile usability
- SEO
- semantic HTML
- JavaScript interactions
- conversion flow
- excessive empty space
- generic template patterns

Do not invent business facts.
`;

    const raw = await callAI(
      [
        {
          role: 'system',
          content: auditSystem
        },
        {
          role: 'user',
          content:
            `AUDIT THIS WEBSITE:\n${clip(html)}`
        }
      ],
      {
        temperature: 0.15,
        max_tokens: 4500
      }
    );

    let result;

    try {
      result = extractJson(raw);
    } catch (_) {
      result = {
        score: 60,
        issues: [
          'AI audit returned invalid JSON.'
        ],
        fixes: [],
        seo: [],
        accessibility: [],
        performance: [],
        ux: [],
        conversion: [],
        imagery: []
      };
    }

    result.issues = [
      ...new Set([
        ...(result.issues || []),
        ...localIssues
      ])
    ];

    result.score = Math.max(
      0,
      Math.min(
        100,
        Number(result.score) || 60
      )
    );

    res.json({
      ok: true,
      result
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error:
        error.message ||
        'Quality check failed.'
    });
  }
});

/* =========================================================
   SEO
   ========================================================= */

app.post('/api/seo', async (req, res) => {
  try {
    const html = String(
      req.body?.html || ''
    );

    if (!html) {
      return res.status(400).json({
        ok: false,
        error: 'No website HTML provided.'
      });
    }

    const raw = await callAI(
      [
        {
          role: 'system',
          content: `
You are a senior SEO specialist.

Return ONLY valid JSON:

{
  "title": "",
  "description": "",
  "keywords": [],
  "ogTitle": "",
  "ogDescription": "",
  "recommendations": []
}

Never invent business facts.
`
        },
        {
          role: 'user',
          content:
            `Analyze this website:\n${clip(html)}`
        }
      ],
      {
        temperature: 0.2,
        max_tokens: 2500
      }
    );

    res.json({
      ok: true,
      result: extractJson(raw)
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error:
        error.message ||
        'SEO optimization failed.'
    });
  }
});

/* =========================================================
   WEBSITE IDEAS
   ========================================================= */

app.post('/api/ideas', async (req, res) => {
  try {
    const niche = String(
      req.body?.niche ||
      'website'
    );

    const raw = await callAI(
      [
        {
          role: 'system',
          content: `
You are a world-class website strategist.

Return ONLY valid JSON:

{
  "ideas": [
    {
      "title": "",
      "prompt": "",
      "angle": ""
    }
  ]
}

Return exactly 5 ideas.

Make them meaningfully different.
`
        },
        {
          role: 'user',
          content:
            `Generate 5 strong website concepts for: ${niche}`
        }
      ],
      {
        temperature: 0.8,
        max_tokens: 2500
      }
    );

    res.json({
      ok: true,
      result: extractJson(raw)
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error:
        error.message ||
        'Idea generation failed.'
    });
  }
});

/* =========================================================
   FALLBACK FRONTEND
   ========================================================= */

app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api/')
  ) {
    return res.sendFile(
      path.join(
        __dirname,
        'public',
        'index.html'
      )
    );
  }

  next();
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found.'
  });
});

/* =========================================================
   START
   ========================================================= */

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `SiteForge AI ${VERSION} running on port ${PORT}`
    );
    console.log(
      `Model: ${model()}`
    );
    console.log(
      `AI configured: ${Boolean(
        process.env.OPENROUTER_API_KEY
      )}`
    );
  }
);
