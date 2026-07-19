# Threat model (MVP)

**Version:** `threat@0.1.0`  
**Scope:** AI Production Readiness Advisor MVP (guided assessment + LLM narrative + in-repo RAG)

## Assets

| Asset | Sensitivity |
|-------|-------------|
| User assessment answers / free text | Medium–High (may include internal system details) |
| Generated readiness reports | Medium |
| Model API keys | Critical |
| Reference corpus | Low (public/educational sources) |
| Prompt templates / system instructions | Medium (abuse if leaked; not secret by itself) |

## Trust boundaries

```
[Browser: assessment state]
        | HTTPS
[Next.js server: /api/assess/narrative]
        | API key
[Model provider]
        ^
[In-repo corpus retrieval — server only]
```

- Browser is untrusted.  
- User free-text is untrusted content.  
- Corpus is trusted allowlist.  
- Model output is untrusted until schema-validated.

## STRIDE-style risks

| ID | Threat | Impact | Mitigation (MVP) |
|----|--------|--------|------------------|
| T-01 | Prompt injection via free-text answers to override band/instructions | Misleading “Production Ready” narrative | Deterministic band in code; delimiters; instruction hierarchy; ignore model band overrides |
| T-02 | Indirect injection via pasted doc text | Same | No arbitrary URL fetch; treat pasted text as data; optional length caps |
| T-03 | Exfiltration of system prompt / keys via model | Key leak / IP | Keys server-only; no tools that return env; minimize system prompt secrets |
| T-04 | PII/secrets in logs | Privacy incident | Do not log raw answers by default; redaction helpers; UUID-only analytics |
| T-05 | Cost abuse (token bomb) | Bill shock | Auth-less rate limit by IP/session; max input chars; max output tokens; daily budget |
| T-06 | XSS via rendered Markdown report | Account/session risk (low without auth) | Sanitize Markdown; no raw HTML from model |
| T-07 | Corpus poisoning (supply chain) | Bad advice | Curate in git; CODEOWNERS-style review; pin corpus version on reports |
| T-08 | User over-trust / fake compliance | Reputational | Persistent disclaimer; no certification seals; copy review |
| T-09 | Model provider data retention | Privacy | Prefer provider zero-retention settings; disclose in privacy note |
| T-10 | SSRF if future URL fetch added | Infra risk | Out of MVP; if added later: allowlist + block private IPs |

## Prompt-injection controls (concrete)

1. System message: role, schema, “never change scores/band”, “citations must be from provided corpus list only”.  
2. Developer/context message: deterministic JSON (scores, gates, retrieved chunks).  
3. User message: clearly fenced:

```
<<<USER_ASSESSMENT_DATA>>>
...json...
<<<END_USER_ASSESSMENT_DATA>>>
```

4. Strip patterns like `ignore previous instructions` is **not** relied on alone — structural separation + deterministic scoring is primary.  
5. Disallow tool calling in narrative path for MVP.

## Privacy posture (MVP)

- Assessments stored in browser only.  
- Server processes narrative request ephemerally.  
- No accounts.  
- Privacy note in UI: what is sent to the model (answers + scores + retrieved chunks).

## Abuse cases to test

See eval scenarios S07–S10 (injection, over-claim, regulated data, schema attack).

## Residual risk

Advisory product can still be misused as fake audit evidence. Mitigation is messaging + watermarking disclaimer in exports — not technical prevention of screenshots.
