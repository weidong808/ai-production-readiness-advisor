# Deploy notes

**Status:** Live on Vercel · custom domain DNS pending  
**Production (Vercel):** https://ai-production-readiness-advisor.vercel.app  
**Custom domain (pending DNS):** https://readiness.weidong-shi.com  
**GitHub:** https://github.com/weidong808/ai-production-readiness-advisor  
**Vercel project:** `wshi/ai-production-readiness-advisor`

## Cloudflare DNS (owner action)

Nameservers stay on Cloudflare. Add this record (**DNS only** / grey cloud):

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `readiness` | `76.76.21.21` | DNS only |

Alternative: CNAME `readiness` → `cname.vercel-dns.com` (DNS only).

See also hub docs: `weidong-website/docs/cloudflare-dns.md`.

## Environment variables (Vercel Production)

| Name | Required | Notes |
|------|----------|-------|
| `OPENAI_API_KEY` | Yes | Set in Vercel dashboard / CLI — server-only |
| `OPENAI_MODEL` | No | `gpt-4.1-mini` |
| `AI_NARRATIVE_ENABLED` | No | Default on; `false` for scores-only |
| `AI_RATE_LIMIT_PER_IP_PER_DAY` | No | Default `10` |
| `AI_MAX_OUTPUT_TOKENS` | No | Default `1500` |
| `AI_MAX_BODY_BYTES` | No | Default `48000` |
| `AI_MAX_FREE_TEXT_CHARS` | No | Default `4000` |

Local `.env` is gitignored and listed in `.vercelignore` so it is not uploaded on deploy.

## Deploy commands

```bash
npm run build
npx vercel --prod
```

GitHub is connected — pushes to `master` can trigger production deploys when enabled in the Vercel project.

## Smoke checklist

1. `/` shows brand + Start assessment  
2. Complete assessment → band renders even if narrative fails  
3. With valid `OPENAI_API_KEY`, narrative summary/risks/citations appear  
4. Export Markdown includes disclaimer  
5. Custom domain valid after DNS propagates  
