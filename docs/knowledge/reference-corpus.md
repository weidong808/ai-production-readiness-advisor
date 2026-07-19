# Reference corpus plan

**Version:** `corpus@0.1.0`  
**Goal:** Small, curated, citation-grade chunks for remediation advice — not a giant scraped index.

## Principles

1. Prefer public, stable, high-signal sources (standards, well-known frameworks, vendor-neutral guidance).  
2. Every chunk has a stable `id`, title, source, license/notes, and short text.  
3. Reports must cite only IDs present in the active corpus version.  
4. Keep MVP corpus to **~20–40 chunks** across 8 dimensions.  
5. Store eventual chunk files under `content/corpus/` (to be added at implementation); this doc is the index.

## Chunk ID convention

`CORP-<AREA>-<NN>`

Areas: `USE`, `DATA`, `EVAL`, `SEC`, `OPS`, `OBS`, `HUM`, `COST`, `GEN`

## Seed index (MVP targets)

| ID | Dimension | Title | Intended source class | Status |
|----|-----------|-------|----------------------|--------|
| CORP-GEN-01 | Gen | Advisory AI systems — limits of checklists | Original educational note | Draft needed |
| CORP-USE-01 | D1 | Define success metrics before model selection | Original | Draft needed |
| CORP-USE-02 | D1 | Misuse & dual-use brainstorming | Original | Draft needed |
| CORP-DATA-01 | D2 | Minimize data sent to models | Original + industry practice | Draft needed |
| CORP-DATA-02 | D2 | Prompt/log retention hygiene | Original | Draft needed |
| CORP-DATA-03 | D2 | Provider training / data use settings | Original | Draft needed |
| CORP-EVAL-01 | D3 | Golden sets and regression gates for LLM apps | Original | Draft needed |
| CORP-EVAL-02 | D3 | Groundedness / schema validation checks | Original | Draft needed |
| CORP-EVAL-03 | D3 | Online feedback loops | Original | Draft needed |
| CORP-SEC-01 | D4 | Prompt injection basics for app builders | Align with OWASP LLM Top 10 themes | Draft needed |
| CORP-SEC-02 | D4 | Least privilege for tool-calling agents | Original | Draft needed |
| CORP-SEC-03 | D4 | Separating instructions from untrusted content | Original | Draft needed |
| CORP-OPS-01 | D5 | Fallbacks and degrade paths | Original | Draft needed |
| CORP-OPS-02 | D5 | Prompt/model rollback | Original | Draft needed |
| CORP-OBS-01 | D6 | Traceability for AI requests | Original | Draft needed |
| CORP-OBS-02 | D6 | Privacy-safe AI logging | Original | Draft needed |
| CORP-HUM-01 | D7 | Accountable owner for AI outputs | Original | Draft needed |
| CORP-HUM-02 | D7 | Human review for high-impact actions | Original | Draft needed |
| CORP-COST-01 | D8 | Caps, budgets, and model tiering | Original | Draft needed |
| CORP-COST-02 | D8 | Safe caching of AI responses | Original | Draft needed |

## Attribution policy

- Original educational notes: MIT with product.  
- If quoting external frameworks (NIST AI RMF, OWASP LLM Top 10, etc.): paraphrase + link; do not paste large copyrighted excerpts.  
- Record `sourceUrl` and `licenseNote` on each chunk file.

## Retrieval design (MVP)

- Embeddings optional in v1: start with **keyword / dimension-tagged retrieval** (select chunks by weak dimensions + risk tags).  
- Upgrade to embeddings when keyword quality plateaus.  
- Always pass ≤ k chunks (k=6 default) into the prompt with IDs visible.

## Acceptance for corpus v0.1

- [x] All seed IDs have short educational chunks (`content/corpus/corpus.json`)  
- [x] Each dimension has ≥2 chunks  
- [x] No certification/compliance overclaim language  
- [ ] Manual review by owner 

## Out of corpus MVP

- Full NIST/ISO document dumps  
- Vendor marketing pages  
- Live web search results  
