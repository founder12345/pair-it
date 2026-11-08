# PAIR IT — AI Explanation Proxy

Small Fastify server that keeps your LLM API key off the browser.

## Quick start

```bash
npm install
cp .env.example .env
# Add AI_API_KEY=xai-...
npm run dev
```

Listens on `http://localhost:3001`.

## Frontend wiring

In the main app `.env`:

```
VITE_AI_PROXY_URL=http://localhost:3001/api/explain
```

## Production

- Deploy this service behind HTTPS.
- Restrict CORS `origin` to your frontend domain.
- Prefer short-lived keys / rotate regularly.

## Supported providers

Any OpenAI-compatible Chat Completions API:

- xAI → `https://api.x.ai/v1` + `grok-4.3` / `grok-4.7`
- OpenAI → `https://api.openai.com/v1` + `gpt-4o`
