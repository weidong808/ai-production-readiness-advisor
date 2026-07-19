# Deploy notes

**Status:** prepared for Vercel; public URL TBD  
**Proposed subdomain:** `readiness.weidong-shi.com` (owner confirmation still open)

## Prerequisites

1. Local `.env` with `OPENAI_API_KEY` (never commit)  
2. Vercel project linked to this repo (when remote exists)  
3. DNS CNAME for chosen subdomain → Vercel  

## Environment variables (Vercel)

| Name | Required | Notes |
|------|----------|-------|
| `OPENAI_API_KEY` | Yes (for narrative) | Server-only |
| `OPENAI_MODEL` | No | Default `gpt-4.1-mini` |
| `AI_NARRATIVE_ENABLED` | No | `false` forces scores-only |
| `AI_RATE_LIMIT_PER_IP_PER_DAY` | No | Default `10` |
| `AI_MAX_OUTPUT_TOKENS` | No | Default `1500` |
| `AI_MAX_BODY_BYTES` | No | Default `48000` |
| `AI_MAX_FREE_TEXT_CHARS` | No | Default `4000` |

## Deploy commands (when ready)

```bash
npm run build
npx vercel            # preview
npx vercel --prod     # production
```

Or connect the GitHub repo to Vercel and deploy on push.

## Smoke checklist after deploy

1. `/` shows brand + Start assessment  
2. Complete a short assessment → report band renders even if narrative fails  
3. Narrative succeeds with valid key → summary/risks/citations appear  
4. Export Markdown includes disclaimer  
5. Oversized POST body is rejected  

## Portfolio follow-ups (after live URL)

- Hub work card + insights case study on weidong-shi.com  
- LinkedIn package under site `docs/`  
- Confirm App #3 positioning in public roadmap (draft note already proposed)  
