# Hard-gate & band fixtures

Checked-in regression pack for the deterministic scoring engine.

| Prefix | Purpose |
|--------|---------|
| `hg-01` … `hg-10` | One fixture per hard gate — gate fires, ceiling + reason text stable |
| `band-*` | Full assessments landing in each `scoreBand` |
| `inj-01` | Free-text prompt injection cannot change score, band, or gates |

Run: `npm test` (see `src/lib/scoring/hard-gates.fixtures.test.ts`).

Threshold unit checks for `bandFromScore` (44/45, 69/70, 84/85) live in the same test file.
