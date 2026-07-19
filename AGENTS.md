# Agent notes — AI Production Readiness Advisor

## Identity

- Product: **AI Production Readiness Advisor** (AI in Action App #3)
- Domain (planned): TBD subdomain under `weidong-shi.com`
- Series: AI in Action — personal lab / professional portfolio
- Philosophy: **Build → Validate → Improve → Document → Share**
- Public north star: https://github.com/weidong808/ai-in-action-roadmap

## Hard rules

1. **Discovery before substantial coding.** Do not scaffold the full app until discovery docs in `docs/` are reviewed by the owner.
2. Keep **educational / showcase** framing. No monetization, pricing, or private business strategy in this repo.
3. Do **not** invent employer/client portfolio work.
4. Outputs are **advisory only** — never claim certification, compliance sign-off, or audit equivalence.
5. Prefer **deterministic scoring** for readiness bands; LLM for narrative, citations, and remediation wording.
6. Treat user assessment answers and free-text as **sensitive** — minimize retention; no training on user data.
7. Experience framing on public content: **"20+ years"** (never "28 years").

## Relationship to other apps

| App | Role |
|-----|------|
| RetireCheck | Live AI in Action #1 |
| SleepCheck | Live AI in Action #2 |
| **This app** | App #3 — enterprise/engineering readiness advisor (not a wellness Check app) |
| HabitCheck | Separate Better Living candidate; not replaced by this repo |

## Preferred stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- Prefer server components; client for interactive assessment UI
- Schema-validated structured outputs for AI responses
- In-repo reference corpus + retrieval (keep corpus small and reviewable)
- **LLM provider (MVP):** OpenAI — `OPENAI_API_KEY` server-only (see `.env.example`); never commit keys or send them to the client

## Doc ownership

| Concern | Location |
|---------|----------|
| Product handoff | `docs/handoff/` |
| Discovery & decisions | `docs/discovery/` |
| Question bank / rubric / schema | `docs/product/` |
| Security | `docs/security/` |
| RAG corpus plan | `docs/knowledge/` |
| Evals | `docs/eval/` |
| Architecture & cost | `docs/architecture/` |
| Delivery | `docs/delivery/` |

## Working principle

Ship an independently useful advisor first. Shared foundations with other AI in Action apps come later, only when duplication is real.
