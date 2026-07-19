# Structured output schema

**Version:** `report@0.1.0`  
**Format:** JSON Schema Draft 2020-12 (conceptual; implement as Zod/JSON Schema in app)

## Design rules

1. UI and exports render **only** from schema-valid objects.  
2. Deterministic fields (`scores`, `band`, `hardGatesApplied`) are computed in code and **passed into** the LLM as read-only context — the model must not override them.  
3. LLM may fill: `executiveSummary`, `dimensionNarratives`, `risks`, `remediationPlan`, `citations`.  
4. Every remediation item should cite `0..n` corpus IDs; evals prefer ≥1 for high-severity risks.

## Types

### AssessmentContext

```json
{
  "assessmentId": "uuid",
  "createdAt": "ISO-8601",
  "rubricVersion": "rubric@0.1.0",
  "questionsVersion": "questions@0.1.0",
  "corpusVersion": "corpus@0.1.0",
  "systemName": "string",
  "jobToBeDone": "string",
  "audience": "employees|customers|public|mixed|unclear",
  "interactionMode": "assistive|autonomous_tools|batch|unclear",
  "dataSensitivity": "public|internal|pii|regulated",
  "blastRadius": "low|recoverable|material|safety_critical",
  "targetEnvironment": "prototype|pilot|production|unclear"
}
```

### DimensionScore

```json
{
  "dimensionId": "D1",
  "name": "Use case & risk fit",
  "score": 0,
  "band": "Not Ready",
  "answers": [
    { "questionId": "D1.Q1", "choice": "B", "points": 2 }
  ]
}
```

### HardGateApplication

```json
{
  "gateId": "HG-05",
  "ceiling": "Not Ready",
  "reason": "Autonomous tools with weak prompt-injection posture"
}
```

### RiskItem

```json
{
  "id": "R1",
  "severity": "critical|high|medium|low",
  "title": "string",
  "description": "string",
  "dimensionIds": ["D4"],
  "citationIds": ["CORP-SEC-01"]
}
```

### RemediationItem

```json
{
  "id": "M1",
  "priority": 1,
  "title": "string",
  "description": "string",
  "effort": "S|M|L",
  "dimensionIds": ["D4"],
  "citationIds": ["CORP-SEC-01"]
}
```

### Citation

```json
{
  "id": "CORP-SEC-01",
  "title": "string",
  "source": "string",
  "chunkId": "string",
  "url": "string|null"
}
```

### ReadinessReport

```json
{
  "schemaVersion": "report@0.1.0",
  "context": { "$ref": "AssessmentContext" },
  "overallScore": 0,
  "scoreBand": "Pilot Only",
  "finalBand": "Not Ready",
  "hardGatesApplied": [],
  "dimensions": [],
  "executiveSummary": "string",
  "dimensionNarratives": [
    { "dimensionId": "D1", "narrative": "string" }
  ],
  "risks": [],
  "remediationPlan": [],
  "citations": [],
  "disclaimer": "Advisory only. Not a certification, audit, or legal opinion.",
  "model": {
    "provider": "string",
    "modelId": "string",
    "promptVersion": "string",
    "narrativeStatus": "ok|unavailable|schema_failed"
  }
}
```

## LLM output contract (subset)

The model returns only:

```json
{
  "executiveSummary": "string",
  "dimensionNarratives": [{ "dimensionId": "D1", "narrative": "string" }],
  "risks": [],
  "remediationPlan": [],
  "citationIdsUsed": ["CORP-SEC-01"]
}
```

Server merges with deterministic fields, resolves citations from corpus, validates full `ReadinessReport`.

## Validation failures

| Failure | Behavior |
|---------|----------|
| Invalid LLM JSON | `narrativeStatus=schema_failed`; show scores/band only |
| Unknown citation ID | Drop citation; flag in eval |
| Model attempts to change `finalBand` | Ignore; keep code band |

## Example (abridged)

See `docs/eval/fixtures/scenario-02-expected-report.json`.
