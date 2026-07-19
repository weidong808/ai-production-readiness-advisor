# Readiness rubric

**Version:** `rubric@0.1.0`  
**Companion:** `questions@0.1.0`

## Dimension score

For each dimension D1–D8 with questions Q1–Q4:

```
dimension_score = round(100 * sum(points) / (3 * num_answered_scored_questions))
```

- Points per ordinal answer: A=3, B=2, C=1, D=0  
- If a question is skipped, exclude from denominator (MVP allows skip with warning)  
- Boolean mapped questions (if any later): true=3, false=0  

Clamp to `[0, 100]`.

### Dimension band (from score)

| Score | Dimension band |
|------:|----------------|
| 85–100 | Production Ready |
| 70–84 | Production with Guards |
| 45–69 | Pilot Only |
| 0–44 | Not Ready |

## Overall score

```
overall_score = round(average of dimension_scores)
```

Equal weights in v0.1. (Future: risk-weighted by context.)

## Overall band (before hard gates)

Same thresholds as dimension band, applied to `overall_score`.

## Hard gates (ceiling rules)

Apply **after** score-based band. Final band = lowest ceiling among applicable gates (and never higher than score-based band).

| ID | When | Ceiling | Rationale |
|----|------|---------|-----------|
| HG-01 | `C0.3 = D` OR `C0.6 = D` OR `C0.1` empty | `Pilot Only` | Cannot honestly claim production readiness with unclear scope |
| HG-02 | `C0.4 = D` (regulated) AND D7 score < 70 | `Not Ready` | Regulated data without strong oversight |
| HG-03 | `C0.4 ∈ {C,D}` AND D2.Q2 = D | `Not Ready` | Raw sensitive data to models |
| HG-04 | `C0.2 = C` (public) AND D3 score < 70 | `Pilot Only` | Public generative needs stronger eval |
| HG-05 | `C0.3 = B` (autonomous tools) AND D4.Q1 ∈ {C,D} | `Not Ready` | Tool-calling + weak injection posture |
| HG-06 | `C0.3 = B` AND D4.Q3 ∈ {C,D} | `Not Ready` | Broad tools / side effects unconstrained |
| HG-07 | `C0.5 = D` (safety-critical) | `Pilot Only` | This advisor does not green-light safety-critical AI |
| HG-08 | D3.Q1 = D AND `C0.6 = C` | `Pilot Only` | No fixtures while targeting production |
| HG-09 | D7.Q1 ∈ {C,D} AND `C0.6 = C` | `Production with Guards` max | No accountable owner |
| HG-10 | D5.Q1 = D AND `C0.6 = C` | `Pilot Only` | No fallback for production target |

### Gate application algorithm

```
band := score_band(overall_score)
for gate in applicable_hard_gates:
  band := min(band, gate.ceiling)
return band
```

Band order (low → high): `Not Ready` < `Pilot Only` < `Production with Guards` < `Production Ready`.

## Band definitions (user-facing)

| Band | Meaning |
|------|---------|
| **Not Ready** | Material gaps; do not ship to real users |
| **Pilot Only** | Limited audience, explicit kill switch, active learning |
| **Production with Guards** | Can ship with monitoring, caps, human paths, and listed remediations |
| **Production Ready** | Strong across dimensions; remaining items are polish / continuous improvement |

## Evidence confidence (MVP)

MVP does not require uploaded evidence. Optional notes do not change scores. Future: evidence can raise confidence badge without changing band.

## Changelog

- `0.1.0` — Initial eight dimensions, four bands, HG-01…HG-10
