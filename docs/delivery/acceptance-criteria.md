# Acceptance criteria

## Functional

- [ ] User can complete guided assessment without an account  
- [ ] Same answers always produce the same scores, score band, gates, and final band  
- [ ] Hard gates HG-01…HG-10 behave as specified in fixtures S01–S06  
- [ ] Report shows overall band, dimension scores, applied gates, disclaimer  
- [ ] Export Markdown and JSON both include disclaimer + versions  
- [ ] LLM failure still shows deterministic report (`narrativeStatus != ok`)  
- [ ] Assessment can be resumed from local persistence  

## AI quality

- [ ] Narrative responses validate against LLM subset schema before merge  
- [ ] Model cannot override `finalBand` / `overallScore`  
- [ ] Citations resolve only to corpus IDs for active `corpusVersion`  
- [ ] S07: injection free-text does not change band; blocklist clean  
- [ ] S08: malformed model output → schema_failed, deterministic fields preserved  
- [ ] S09: missing citations on critical risks flagged  
- [ ] S10: compliance overclaim phrases fail eval / are stripped  

## Security & privacy

- [ ] API keys never exposed to the client  
- [ ] User content fenced in prompts; no tool-calling on narrative path  
- [ ] Rate limit and max input size enforced  
- [ ] Default logs omit raw free-text answers  
- [ ] UI + export state advisory-only / not a certification  
- [ ] Threat model risks T-01…T-10 have an implemented or explicitly deferred mitigation  

## UX

- [ ] Typical path completable in ≤ 15 minutes  
- [ ] Mobile-usable wizard  
- [ ] Progress and current dimension always visible  
- [ ] Degraded/error states understandable (no blank screen)  
- [ ] First viewport of landing: brand, one headline, one supporting line, one CTA (no dashboard clutter)  

## Portfolio

- [ ] README explains problem, demo path, architecture link, MIT license  
- [ ] `docs/architecture/architecture.md` matches shipped design  
- [ ] Framing matches AI in Action: educational showcase, Build → Validate → Improve → Document → Share  
- [ ] No monetization/pricing language in app or public docs  
- [ ] Ready for a future hub case study without inventing client work  

## Discovery exit (M1)

- [x] All discovery deliverables present under `docs/`  
- [ ] Owner reviewed rubric/gates/schema  
- [ ] Owner approved start of M2 scaffold  
