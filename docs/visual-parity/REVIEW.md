# Readiness visual parity — Phase 2 review

**Status:** shipping (owner: go and verify and push)  
**App:** AI Production Readiness Advisor · home `/`  
**Plan:** [weidong-website/docs/apps-visual-parity/PLAN.md](https://github.com/weidong808/weidong-website/blob/main/docs/apps-visual-parity/PLAN.md)

## What changed

| Surface | Before | After |
| ------- | ------ | ----- |
| Home H1 | Brand name | Human headline: *Is your AI system ready for production?* |
| Brand | Was H1 | Display name above headline |
| Benefit | Technical blurb + old tagline | *Launch AI with confidence* (chrome) + eight-dimension benefit line |
| CTAs | Start assessment + View sample | **Start assessment** + **Read the story** → hub case study |
| Product proof | Below fold in “What you get” | `LandingPreview` in hero (sample report, not architecture) |
| Disclaimer | Footer / muted | Loud warn callout under trust line |
| About | Tagline as H1 | Human headline + Try/Story CTAs + disclaimer callout |
| Footer | Name only | + tagline under name |
| Tagline (chrome / meta) | Is your AI feature ready to ship? | Launch AI with confidence |

## Acceptance checklist

- [x] Human headline + benefit above the fold
- [x] Real product visual (LandingPreview sample report)
- [x] Dominant Try CTA + secondary hub story link
- [x] Light + dark captured (see `review/`)
- [x] Advisory disclaimer stays loud
- [ ] CI green + Vercel success (after push)

## Review shots

| File | Viewport | Theme |
| ---- | -------- | ----- |
| [review/after-390-light.png](./review/after-390-light.png) | 390 | light |
| [review/after-390-dark.png](./review/after-390-dark.png) | 390 | dark |
| [review/after-1440-light.png](./review/after-1440-light.png) | 1440 | light |
| [review/after-1440-dark.png](./review/after-1440-dark.png) | 1440 | dark |

Re-capture: `node scripts/capture-visual-parity.mjs` (requires local `npm run dev` + Playwright).

## Files

- `src/lib/brand.ts`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/components/AppFooter.tsx`
- `src/components/LandingPreview.tsx`

## Out of scope

- Scoring / hard gates / narrative pipeline
- Hub collage recapture
- Round 2 craft (forms, radar polish)
