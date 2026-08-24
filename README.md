# SiteForge AI™ — Premium Edition

This edition includes a complete premium Black + Luxury Gold builder interface with a large live canvas, AI Copilot inspector, quality system, responsive device controls, command-style prompt composer, and polished micro-interactions.

# SiteForge AI™

SiteForge AI is a premium AI website-builder SaaS shell that turns natural-language briefs into complete standalone responsive websites. It includes an AI Architect workflow, live preview, device previews, AI editing, quality checks, project persistence and HTML export.

## Stack

- Vanilla HTML/CSS/JavaScript frontend
- Vercel serverless API
- OpenRouter server-side integration
- No frontend API key exposure
- Local browser storage for projects/activity in this starter
- Generated websites are standalone HTML documents

## 1. Install

```bash
npm install
```

## 2. Configure OpenRouter

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your real OpenRouter key:

```env
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openai/gpt-4.1-mini
APP_URL=http://localhost:3000
```

Never commit `.env.local`.

## 3. Run locally

```bash
npm run dev
```

Open the local Vercel URL shown in the terminal.

## 4. Deploy to Vercel

Push the project to GitHub, import it into Vercel, and add these Environment Variables in the Vercel dashboard:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (optional)
- `APP_URL` (recommended)

Deploy. The frontend calls `/api/generate`, so the OpenRouter secret remains server-side.

## 5. How it works

### Generate
`app.js` sends:

```json
{
  "action": "generate",
  "prompt": "..."
}
```

to `/api/generate`.

The server calls OpenRouter and asks the model for a complete standalone HTML document. The server validates the response shape, calculates a lightweight quality score, and returns the HTML to the browser.

### Edit
The bottom AI bar sends the existing generated HTML plus an instruction:

```json
{
  "action": "edit",
  "html": "...",
  "instruction": "Make the hero more luxurious..."
}
```

The model returns a revised complete HTML document.

## Security notes

- Do not place `OPENROUTER_API_KEY` in frontend code.
- Do not commit `.env.local`.
- The preview iframe uses sandboxing.
- For a production multi-user SaaS, add authentication, database-backed projects, server-side rate limiting, usage quotas, request logging, and stronger HTML sanitization before allowing generated sites to be persisted or deployed.
- The current browser project history uses `localStorage`; this is intentionally dependency-light and should be replaced with a database for a commercial multi-user release.

## Recommended production roadmap

1. Auth + workspaces
2. Postgres/Supabase project storage
3. Streaming AI responses
4. Version history / undo / restore
5. Visual section selection and regeneration
6. Brand kit persistence
7. Template marketplace
8. GitHub export
9. Vercel deployment integration
10. Stripe subscriptions and usage limits
11. Server-side generated-site sanitization
12. Automated Lighthouse-style checks

## License

Add your commercial license terms before distributing the product.
