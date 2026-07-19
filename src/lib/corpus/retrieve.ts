import { getCorpus } from "@/lib/corpus/load";
import type { CorpusChunk } from "@/lib/corpus/types";
import type { ScoringResult } from "@/lib/scoring/types";

const DEFAULT_K = 6;

/** Keyword / dimension-tagged retrieval — no vector DB in MVP. */
export function retrieveChunks(
  scoring: ScoringResult,
  k = DEFAULT_K,
): CorpusChunk[] {
  const weakDims = [...scoring.dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d) => d.dimensionId);

  const gateText = scoring.hardGatesApplied
    .map((g) => `${g.gateId} ${g.reason}`)
    .join(" ")
    .toLowerCase();

  const scored = getCorpus().chunks.map((chunk) => {
    let score = 0;
    for (const dim of weakDims) {
      if (chunk.dimensionIds.includes(dim)) score += 5;
    }
    if (chunk.dimensionIds.length === 0) score += 1; // general advisory
    for (const tag of chunk.tags) {
      if (gateText.includes(tag.replace("-", " "))) score += 2;
      if (gateText.includes(tag)) score += 2;
    }
    if (
      scoring.hardGatesApplied.some((g) => g.gateId.startsWith("HG-0")) &&
      chunk.id.startsWith("CORP-SEC")
    ) {
      score += 1;
    }
    // Prefer security/eval chunks when final band is low
    if (
      (scoring.finalBand === "Not Ready" || scoring.finalBand === "Pilot Only") &&
      (chunk.id.startsWith("CORP-SEC") || chunk.id.startsWith("CORP-EVAL"))
    ) {
      score += 2;
    }
    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))
    .filter((s) => s.score > 0)
    .slice(0, k)
    .map((s) => s.chunk);
}
