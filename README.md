# PAIR IT

**Every dish has its match.**

Premium food & beverage discovery platform — React, Three.js, intelligent pairing engine, optional AI explanations.

**Live repo:** https://github.com/founder12345/pair-it

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel

1. Import this repository at [vercel.com/new](https://vercel.com/new)
2. Framework: **Vite** (auto-detected)
3. Build: `npm run build` → Output: `dist`
4. Deploy

### Optional AI explanations

In Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `VITE_AI_PROXY_URL` | `/api/explain` |
| `AI_API_KEY` | your xAI or OpenAI key |
| `AI_BASE_URL` | `https://api.x.ai/v1` (optional) |
| `AI_MODEL` | `grok-4.3` (optional) |

Redeploy after adding variables.

CLI:

```bash
npx vercel
npx vercel --prod
```

## Project structure

```
api/explain.js          Vercel serverless AI proxy
src/
  components/           AgeGate, HeroVisual (R3F)
  pages/                Discover, Pair, Explore, My Taste, Profile
  data/                 Dishes, beverages, pairings
  lib/                  Pairing engine + AI explanations
server/                 Local Fastify AI proxy (optional)
```

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4
- Three.js + React Three Fiber + Drei
- Framer Motion + React Router
- Vercel serverless `/api/explain` (xAI / OpenAI-compatible)

## Local AI proxy (optional)

```bash
cd server
npm install
cp .env.example .env   # add AI_API_KEY
npm run dev
```

Frontend `.env`:

```
VITE_AI_PROXY_URL=http://localhost:3001/api/explain
```

## Notes

- Age gate required before content
- Demonstration data is clearly identified
- Menu scanner uses mock extraction in this build
- Preferences stored in localStorage

—

Every dish has its match.
