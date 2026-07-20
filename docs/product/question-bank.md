# Question bank

**Version:** `questions@0.1.0`  
**Scoring:** Each scored item maps to a dimension criterion in `readiness-rubric.md`.  
**Answer types:** `single` (A–D ordinal), `boolean`, `multi` (flags), `text` (not scored).

Scoring convention for ordinal A–D:

| Choice | Points |
|--------|--------|
| A | 3 (strong) |
| B | 2 (adequate) |
| C | 1 (weak) |
| D | 0 (missing / unsafe) |

---

## Section 0 — Context (required, mostly unscored)

| ID | Prompt | Type | Notes |
|----|--------|------|-------|
| C0.1 | What are you assessing? | text | Feature/system name |
| C0.2 | Primary user audience | single | A employees · B authenticated customers · C public anonymous · D mixed / unclear |
| C0.3 | AI interaction mode | single | A assistive (human always acts) · B autonomous actions with tools · C batch offline · D unclear |
| C0.4 | Data sensitivity | single | A public · B internal · C PII/sensitive · D regulated (health/finance/gov) |
| C0.5 | Blast radius if wrong | single | A low annoyance · B recoverable user harm · C material business/legal risk · D safety-critical |
| C0.6 | Target environment | single | A prototype · B limited pilot · C production · D unclear |
| C0.7 | One-sentence job-to-be-done | text | Used in narrative |

Context feeds **hard gates** (see rubric), not the average score alone.

---

## D1 — Use-case & risk fit

| ID | Prompt | Choices (A→D) |
|----|--------|----------------|
| D1.Q1 | Is the job-to-be-done crisp enough to evaluate success? | A measurable success criteria · B clear but qualitative · C fuzzy · D “AI for AI’s sake” |
| D1.Q2 | Have misuse / dual-use cases been listed? | A documented + owners · B informal list · C acknowledged only · D not considered |
| D1.Q3 | Is the AI the right tool vs deterministic software? | A evaluated alternatives · B mostly justified · C assumed · D unknown |
| D1.Q4 | Is failure acceptable for this use case? | A yes, with UX for failure · B mostly · C rarely · D never but no controls |

## D2 — Data & privacy

| ID | Prompt | Choices |
|----|--------|---------|
| D2.Q1 | Are training / fine-tune / RAG data sources inventory’d? | A inventory + owners · B partial · C unknown mix · D includes unvetted sensitive data |
| D2.Q2 | Is PII minimized before model calls? | A systematic redaction/minimization · B partial · C ad hoc · D raw PII routinely sent |
| D2.Q3 | Are retention & deletion rules defined for prompts/logs? | A documented + enforced · B documented only · C unclear · D indefinite retention of raw content |
| D2.Q4 | Is user content used for provider training? | A contractually excluded / self-hosted · B unknown but gated · C default provider settings · D opted into training on user data |

## D3 — Evaluation quality

| ID | Prompt | Choices |
|----|--------|---------|
| D3.Q1 | Do you have a golden / fixture set for critical behaviors? | A versioned + CI · B exists, manual · C a few examples · D none |
| D3.Q2 | Are regression checks run before prompt/model changes? | A required gate · B sometimes · C rarely · D never |
| D3.Q3 | Do you measure groundedness / citation / schema validity (as relevant)? | A automated metrics · B spot checks · C vibe checks · D none |
| D3.Q4 | Is there an online quality / feedback loop after launch? | A monitored + reviewed · B metrics only · C informal reports · D none |

## D4 — Security & abuse

| ID | Prompt | Choices |
|----|--------|---------|
| D4.Q1 | Prompt-injection / untrusted content handling? | A threat model + mitigations tested · B basic delimiters/filters · C assumed safe · D model sees raw untrusted content with tools |
| D4.Q2 | AuthN/AuthZ for AI actions and data access? | A least privilege + audited · B standard app auth only · C partial · D model can reach broad data/tools |
| D4.Q3 | Tool / function calling constraints? | A allowlist + confirmation for side effects · B allowlist only · C broad tools · D N/A no tools (score as B if truly N/A) |
| D4.Q4 | Secrets & supply chain for models/prompts/deps? | A managed secrets + pinned deps · B partial · C secrets in prompts/repos risk · D unknown |

## D5 — Reliability & ops

| ID | Prompt | Choices |
|----|--------|---------|
| D5.Q1 | Defined fallback when model/provider fails? | A graceful degrade tested · B basic error UX · C retry only · D hard fail / blank |
| D5.Q2 | Can you roll back model/prompt/config quickly? | A one-click / flagged · B redeploy · C hard · D no versioning |
| D5.Q3 | Dependency & quota failure modes understood? | A runbooks · B known, informal · C hope · D unknown |
| D5.Q4 | Load / latency expectations documented? | A budgets + tests · B targets only · C unknown · D ignored |

## D6 — Observability

| ID | Prompt | Choices |
|----|--------|---------|
| D6.Q1 | Can you trace a single request end-to-end? | A trace ids across AI + app · B app logs only · C partial · D no |
| D6.Q2 | Are prompt/template/model versions recorded per request? | A always · B often · C rarely · D never |
| D6.Q3 | Privacy-safe logging (no raw secrets/PII by default)? | A redaction policy enforced · B best effort · C logs everything · D unknown |
| D6.Q4 | Alerting on quality/safety/cost anomalies? | A alerted + owned · B dashboards only · C none · D none and high traffic |

## D7 — Human oversight

| ID | Prompt | Choices |
|----|--------|---------|
| D7.Q1 | Who is accountable for AI outputs in production? | A named owner · B team vague · C “the model” · D nobody |
| D7.Q2 | Escalation path when AI is wrong/harmful? | A documented + practiced · B documented · C improvised · D none |
| D7.Q3 | Human review for high-impact actions? | A required · B sampling · C none needed & justified · D none though impact is high |
| D7.Q4 | User-facing uncertainty / limitations communicated? | A clear UX + docs · B partial · C overconfident UX · D hidden |

## D8 — Cost & performance

| ID | Prompt | Choices |
|----|--------|---------|
| D8.Q1 | Token/cost budget per request/user/day? | A enforced caps · B monitored · C unknown · D unlimited |
| D8.Q2 | Caching / dedup for repeated prompts? | A yes where safe · B partial · C no · D no and high volume |
| D8.Q3 | Model tiering (cheap vs strong) by task? | A deliberate · B single model ok for scale · C oversized model everywhere · D unknown spend |
| D8.Q4 | Latency budget compatible with UX? | A measured p95 · B rough · C unknown · D known breach |

---

## Optional free-text (unscored)

| ID | Prompt |
|----|--------|
| X.1 | Top concern you already worry about |
| X.2 | Links to design docs / eval notes (optional; stored locally only) |
| X.3 | Anything the questions missed |

## Adaptive rules (MVP-light)

1. If `C0.3 = B` (autonomous tools), force D4.Q3 visible and weight D4 hard gates.  
2. If `C0.4 ∈ {C,D}`, enforce D2 and D7 hard gates.  
3. If `C0.2 = C` (public), raise evaluation expectations (D3 hard gate).  
4. If `C0.3 = D` or `C0.6 = D`, cap band at `Not Ready` until clarified (soft: warn + ceiling `Pilot Only` in v0.1 — see rubric HG-01).
