# Deploy notes

**Status:** Live  
**Production:** https://readiness.weidong-shi.com  
**Vercel alias:** https://ai-production-readiness-advisor.vercel.app  
**GitHub:** https://github.com/weidong808/ai-production-readiness-advisor  
**Vercel project:** `wshi/ai-production-readiness-advisor`

## Cloudflare DNS

Configured (**DNS only** / grey cloud):

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `readiness` | `76.76.21.21` | DNS only |

Verified: resolves to `76.76.21.21`; `https://readiness.weidong-shi.com` returns 200.

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

### Rotate / refresh OpenAI key (Production)

If live reports show `narrativeStatus: "unavailable"` with `meta.providerError` containing `401` / `invalid_api_key`:

```powershell
# From repo root — uses local .env only (never commit the key)
npx vercel env rm OPENAI_API_KEY production
# confirm y
Get-Content .env | Where-Object { $_ -match '^\s*OPENAI_API_KEY=' } |
  ForEach-Object { ($_ -replace '^\s*OPENAI_API_KEY=', '').Trim() } |
  npx vercel env add OPENAI_API_KEY production
npx vercel --prod
```

Then run the post-deploy probe below.

## Deploy commands

```bash
npm run build
npx vercel --prod
```

GitHub is connected — pushes to `master` can trigger production deploys when enabled in the Vercel project.

## Post-deploy narrative probe

```powershell
$payload = @{
  input = @{
    context = @{
      systemName = "probe"
      jobToBeDone = "probe"
      audience = "employees"
      interactionMode = "assistive"
      dataSensitivity = "internal"
      blastRadius = "low"
      targetEnvironment = "pilot"
    }
    answers = @{}
  }
} | ConvertTo-Json -Depth 6

$res = Invoke-RestMethod `
  -Uri "https://readiness.weidong-shi.com/api/assess/narrative" `
  -Method POST -ContentType "application/json" -Body $payload

$res.report.model.narrativeStatus   # expect: ok
$res.meta.providerError             # expect: empty / null
```

Forced fallback check (preview or temporary Production toggle): set `AI_NARRATIVE_ENABLED=false`, redeploy or use a preview, confirm scores-only report with warning note, then restore.

## Smoke checklist

1. `/` shows brand + Start assessment (+ about/footer after baseline deploy)  
2. Complete assessment → band renders even if narrative fails  
3. Probe returns `narrativeStatus: "ok"` with summary/risks when key is valid  
4. Export Markdown includes disclaimer  
5. Custom domain `https://readiness.weidong-shi.com` returns 200 
