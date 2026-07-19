# AI Production Readiness Advisor — Post-Launch Improvement Handoff

**Status:** Actionable handoff for implementing agents
**Date:** 2026-07-19
**Audience:** Cursor / Claude Code / Codex / Cowork agents
**Owner:** Weidong Shi
**Live:** https://readiness.weidong-shi.com · **Repo:** https://github.com/weidong808/ai-production-readiness-advisor

> **Opening instruction for the implementing agent:**
> Review the repository against this handoff. Begin with P0 and reproduce the production `narrative=unavailable` condition before changing code. Preserve the deterministic scoring and hard-gate engine untouched. Implement the smallest verified fix, add regression tests, deploy, and verify both narrative success and forced-fallback behavior.

---

## 1. Verified live findings (2026-07-19)

Checked against production at https://readiness.weidong-shi.com:

1. **Live deployment is stale.** Production still serves the pre-consistency build: old `<title>` without tagline, no Open Graph / Twitter metadata, no footer, no `/about` page, no ws-mark. The 2026-07-19 local working tree (see §3) has all of this — **it has not been deployed**. First deploy closes most cosmetic gaps at once.
2. **`narrative=unavailable` defect (P0, reported by owner).** Reports on production render with `narrative=unavailable` in the report footer and the fallback note "Narrative unavailable — scores and band still apply." Scores and bands are correct (deterministic engine is server-side and independent), but the OpenAI advisory narrative — the app's differentiator — never appears. **Live probe 2026-07-19 (Cursor):** `POST /api/assess/narrative` returned `narrativeStatus: "unavailable"` with `meta.providerError: "status_401:invalid_api_key:msg"`. So Production has an `OPENAI_API_KEY` present but **rejected by OpenAI** (rotated/stale key). Prefer re-setting the current local `.env` key into Vercel Production and redeploying over assuming the var is missing.
3. **Landing page undersells the output.** No preview of what a report looks like; a visitor must invest ~10 minutes before seeing any value.
4. **Hub gap:** weidong-shi.com has `/work/retirecheck` and `/work/sleepcheck` pages plus insights articles, but nothing for App #3. Sibling apps cross-link to a case study; this app has no case-study URL to link to.

## 2. `narrative=unavailable` — diagnosis map (do this before any code change)

`narrativeStatus` is set in `src/app/api/assess/narrative/route.ts` + `src/lib/ai/pipeline.ts`. Every failure path emits a structured JSON log line (`console.info`) visible in **Vercel → Project → Logs**. Match the observed `event` to the cause:

| Log event | Cause | Fix |
|---|---|---|
| `narrative_disabled`, `reason: "missing_api_key"` | `OPENAI_API_KEY` not set in Vercel env | Add env var in Vercel for Production, redeploy |
| `narrative_disabled`, `reason: "disabled"` | `AI_NARRATIVE_ENABLED=false` set in env | Unset or set `true` |
| `narrative_rate_limited` | 10/IP/day in-memory limit (`src/lib/ai/rate-limit.ts`) | See P1-3: limit is per serverless instance, resets on cold start; verify before raising |
| `narrative_unavailable` with `providerError` containing `401` / `invalid_api_key` | **Verified live:** key present but rejected by OpenAI | Update Vercel Production `OPENAI_API_KEY` from current local `.env` (never commit), redeploy, re-probe |
| `narrative_unavailable` with other `providerError` | OpenAI call failed (quota, timeout, wrong `OPENAI_MODEL`) | Read `providerError` value; fix quota/model |
| `narrative_schema_failed` with `schemaIssues`/`shapeErrors` | Model returned JSON that failed Zod validation | Tune prompt or add repair pass (P1-2) |

**Reproduction procedure:**

1. `POST https://readiness.weidong-shi.com/api/assess/narrative` with a minimal valid body (schema: `src/lib/schema/assessment.ts`; `answers: {}` is valid):
   ```json
   { "input": { "context": { "systemName": "probe", "jobToBeDone": "probe", "audience": "employees", "interactionMode": "assistive", "dataSensitivity": "internal", "blastRadius": "low", "targetEnvironment": "pilot" }, "answers": {} } }
   ```
2. Inspect `report.model.narrativeStatus` and `meta` in the response; correlate with the Vercel log event.
3. Only then implement the fix. After deploy, re-run the probe (expect `narrativeStatus: "ok"`) **and** force the fallback (temporarily set `AI_NARRATIVE_ENABLED=false` in a preview env) to confirm graceful degradation still works.

## 3. Already done — do not redo (local working tree, 2026-07-19 session)

Series-consistency and wizard work completed locally, build/lint/tests verified (17/17 passing):

- `src/lib/brand.ts` (sibling-app constants pattern), `SiteHomeLink`, `AppFooter`, `Analytics` (`@vercel/analytics` added to package.json + lockfile)
- Full metadata in `layout.tsx` (metadataBase, OG, Twitter, themeColor), `opengraph-image.tsx`, `icon.svg`, `public/ws-mark.svg`
- `/about` page (privacy wording verified against actual cache behavior)
- Wizard: review-step dimension table with Edit-and-return-to-review jumps, hard-gate preview, band badge, "Dimension X of 8" headers, answered-count hints, reset confirmation
- Home: "How it works" CTA, parent-brand link

**Action:** ~~commit and deploy baseline~~ **Done 2026-07-19 (commit `eef2b32`, production redeploy — `/about`, OG, footer live).** Narrative key still blocked — see P0.

## 4. Priorities

### P0 — restore the narrative (blocker for promotion) — DONE 2026-07-19
1. ~~Deploy the 2026-07-19 baseline (§3).~~ **Done** (`eef2b32` live — `/about`, OG, footer).
2. ~~Diagnose and fix `narrative=unavailable`.~~ Root cause: invalid/revoked user key (`401`). Replaced with a valid **service-account** key in local `.env` + Vercel Production; redeployed. Live probe: `narrativeStatus: "ok"`.
3. ~~Post-deploy probe documented~~ in `docs/architecture/deploy.md`.

### P1 — trust and first-run experience — DONE 2026-07-19
1. ~~**One-click sample report** (§6)~~ — `/sample` + `content/samples/sample-report.json` (Production with Guards / HG-09); landing CTA; exports labeled `sample-...`.
2. ~~**Schema-repair pass**~~ — one retry with validation errors in prompt; log `narrative_repaired`; then scores-only fallback.
3. ~~**Rate-limit honesty**~~ — decision: keep in-memory **best-effort** (no KV for MVP); documented in `docs/architecture/cost-estimate.md` (`cost@0.2.0`); UI copy updated.
4. ~~**Landing-page revision** (§7)~~ — hero CTAs, How it works, What you get preview, trust strip.

### P2 — series integration and polish — DONE 2026-07-19 (insight article deferred)
1. ~~Hub `/work/readiness` + project entry~~ in `weidong-website`; ~~`SITE_CASE_STUDY_URL`~~ → `https://weidong-shi.com/work/readiness` in footer/about. Insights article left for a later LinkedIn package.
2. ~~OG~~ — static `public/og.png` (edge `opengraph-image.tsx` removed for cold-start reliability). Validate with LinkedIn Post Inspector after hub deploy.
3. ~~Print / PDF~~ — `window.print()` + print stylesheet on report view. Shareable summary card deferred.
4. ~~A11y baseline~~ — skip links, `aria-live` report states, focus rings, print-safe chrome; full keyboard audit remains ongoing.

## 5. OpenAI narrative contract (preserve exactly)

- Request: server recomputes scores from raw answers (`scoreAssessment`) — **never trust client band**. Free text is truncated (`truncateFreeText`) and redacted (`src/lib/security/redact.ts`) before prompting.
- Response: Zod-validated against `src/lib/schema/narrative.ts` (`report@0.1.0`). `narrativeStatus ∈ {ok, unavailable, schema_failed}`.
- Narrative may **never** change `finalBand`, `overallScore`, dimension scores, or hard gates — merge logic in `src/lib/ai/merge.ts` enforces this; keep its tests green.
- Fallback: any failure returns `buildScoresOnlyReport` — the user always gets scores + band + disclaimer. UI copy for fallback lives in `ReportView.tsx`.
- Cost guardrails: 1-hour in-memory cache keyed on input+versions, per-IP daily limit, `AI_MAX_OUTPUT_TOKENS` (default 1500). Keep all three.

## 6. One-click sample report — specification

Goal: show the full report (with narrative) without answering 20+ questions.

- Add "View sample report" secondary CTA on the landing page.
- Source: a checked-in fixture (`docs/eval/fixtures/` style) representing a realistic internal-assistant assessment that lands in **Production with Guards** with one hard gate — showcases scores, a gate, risks, and remediation.
- Narrative for the sample is **pre-generated and committed** (JSON), not a live OpenAI call — zero cost, instant load, deterministic.
- Route: `/sample` (static). Renders through the existing `ReportView` with a banner: "Sample assessment — start your own to get a report for your system."
- Sample must carry the advisory disclaimer and must not be exportable as if it were a real assessment (label exports `sample-...`).

## 7. Revised landing-page content (draft for implementer)

Keep hero + grid aesthetic. Structure:

1. **Hero** (exists): series eyebrow, H1, one-sentence value prop, CTAs: Start assessment / View sample report.
2. **How it works** — 3 steps: "Describe your system (2 min)" → "Answer 8 dimensions (A–D choices)" → "Get band, gates, risks, remediation."
3. **What you get** — compact visual: band badge, dimension bar, hard-gate chip (reuse real components, static data).
4. **Trust strip** — "Deterministic scoring · answers stay in your browser · advisory, not certification."
5. Footer (exists).

Tone rules: advisory framing everywhere; "20+ years" if experience is mentioned; no certification/compliance claims.

## 8. LinkedIn / Open Graph metadata

- `opengraph-image.tsx` exists (edge runtime, matches RetireCheck pattern). After deploy, validate with LinkedIn Post Inspector and opengraph.xyz; edge-runtime OG images occasionally 500 on cold start — if so, pre-render to static `public/og.png` (SleepCheck pattern) instead.
- Title format: `AI Production Readiness Advisor — Is your AI feature ready to ship?` (set in layout).
- For the eventual LinkedIn article, reuse the series format from `Retirement Calculator/LinkedIn-Article-*.md`.

## 9. Hard-gate regression fixtures

Existing: `docs/eval/fixtures/s01–s10` + `src/lib/scoring/fixtures.test.ts`, `src/lib/eval/narrative-fixtures.test.ts`. Additions required:

- One fixture per hard gate (HG-01…HG-0n, see `src/lib/scoring/hard-gates.ts`) asserting: gate fires, band ceiling applied, gate reason text stable.
- Boundary fixtures: score exactly at each band threshold (`src/lib/scoring/bands.ts`).
- Injection fixture: free-text containing prompt-injection attempts must not raise the band and must not leak into narrative verbatim (redaction + blocklist paths).
- CI: all fixtures run in `npm test`; a failing gate fixture blocks deploy.

## 10. Non-functional requirements

1. **Security:** API key server-only; blocklist + redaction before every prompt; body-size limit (`MAX_BODY_BYTES`) stays; no user content in logs (current `logEvent` discipline — keep).
2. **Privacy:** answers in localStorage only; server processing transient (1h in-memory cache, no DB). Any persistence change requires updating `/about` privacy wording in the same PR.
3. **Cost:** with cache + limit + 1500-token cap, worst case ≈ low single-digit $/month at portfolio traffic. Re-estimate in `docs/architecture/cost-estimate.md` if limits change.
4. **Observability:** keep structured log events; add `narrative_repaired` if P1-2 lands; check Vercel logs weekly for `schema_failed` rate >5%.
5. **Accessibility:** maintain skip links, `aria-live` on async report states, visible focus rings, radio fieldsets. Audit: keyboard-only full wizard pass + report; contrast-check band badge colors against elevated bg.

## 11. Architecture and components (current, keep)

```
src/app/            pages (/, /about, /assess) + /api/assess/narrative (nodejs runtime)
src/components/     AssessmentWizard (client) · ReportView · BandBadge · AppFooter · SiteHomeLink · Analytics
src/lib/scoring/    deterministic engine: points → score → bands + hard-gates   [DO NOT MODIFY without fixtures]
src/lib/ai/         openai client · prompt · pipeline · merge · cache · rate-limit · limits
src/lib/corpus/     in-repo reference corpus + retrieval (citations)
src/lib/security/   redact + blocklist
src/lib/schema/     zod: assessment input · narrative report (versioned)
src/lib/persistence/ localStorage save/resume
```

New components anticipated: `SampleReportBanner`, landing sections (server components), optional `kv`-backed rate limiter behind the existing `checkRateLimit` interface.

## 12. Testing matrix and acceptance criteria

| Area | Test | Acceptance |
|---|---|---|
| P0 fix | Live probe (§2) post-deploy | `narrativeStatus: "ok"` with narrative sections populated |
| Fallback | `AI_NARRATIVE_ENABLED=false` preview | Scores-only report + warning note; no error state |
| Scoring | fixture suite incl. new gate/boundary fixtures | 100% pass; bands unchanged vs. baseline |
| Injection | free-text attack fixture | Band unchanged; redaction flags logged |
| Wizard | keyboard-only full pass; refresh mid-wizard | Resume from saved step; Edit-from-review returns to review |
| Sample | `/sample` load | <1s, no OpenAI call, banner + labeled export |
| OG | LinkedIn Post Inspector | Correct image/title/description |
| Build | `lint`, `test`, `tsc`, `next build` | All green (baseline: 17 tests) |

## 13. Three-release plan

- **R1 (P0):** deploy baseline → diagnose/fix narrative → env-var runbook in `deploy.md` → post-deploy probe. *Exit: live report shows narrative; fallback verified.*
- **R2 (P1):** sample report → landing revision → schema-repair retry → rate-limit decision. *Exit: cold visitor sees a full report in <10s; `schema_failed` <5%.*
- **R3 (P2):** hub `/work/readiness` + case-study links both directions → OG/LinkedIn validation → PDF export → accessibility audit. *Exit: parity with RetireCheck/SleepCheck series integration.*

## 14. Definition of done for public promotion

All of: live narrative works and fallback degrades gracefully; sample report live; hub case-study page live and cross-linked; OG validated on LinkedIn; fixture suite (incl. all hard gates) green in CI; advisory disclaimer present in UI, exports, about, and footer; cost guardrails documented and active; no user content in logs.

---

*Supersedes nothing; complements `APP_3_AI_PRODUCTION_READINESS_ADVISOR_HANDOFF.md` (pre-build discovery handoff). Reconcile product-decision changes in `docs/discovery/01-product-decisions.md`.*
