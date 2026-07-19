# AI Production Readiness Advisor

Guided assessment tool that helps engineers and architects evaluate whether an AI feature or system is ready for production — with structured scores, hard gates, and (next) evidence-backed narrative remediation.

| | |
|--------|--------|
| **Series** | [AI in Action](https://weidong-shi.com) · App #3 |
| **Public roadmap** | [ai-in-action-roadmap](https://github.com/weidong808/ai-in-action-roadmap) |
| **Status** | M4 — evals, security, and cost guards |
| **Owner** | Weidong Shi |

## What this is

An educational portfolio application that demonstrates:

- Structured AI product assessment (deterministic scoring + upcoming LLM narrative)
- Hard-gated readiness bands
- Evaluation fixtures for scoring correctness
- Cost and privacy discipline for LLM features (M3+)

**Philosophy:** Build → Validate → Improve → Document → Share

## What this is not

- Not a compliance certification or audit substitute
- Not legal, security, or regulatory advice
- Not a commercial product catalog entry

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then **Start assessment**.

```bash
npm test    # S01–S06 scoring fixtures
npm run build
```

Copy `.env.example` → `.env` and set `OPENAI_API_KEY` when you reach M3 (narrative). Not required for the scores-only MVP.

## Current phase

| Milestone | Status |
|-----------|--------|
| M1 Discovery | Done (owner approved) |
| M2 Assessment UX + deterministic scoring | Done |
| M3 LLM narrative + RAG (OpenAI) | Done |
| M4 Evals, security, cost guards | **Runnable** |
| M5 Polish, deploy, portfolio | Later |

Docs index: [docs/README.md](docs/README.md)

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Zod for input shapes
- Vitest for scoring fixtures
- OpenAI planned for narrative (M3)

## License

MIT — see [LICENSE](LICENSE).
