import { BANDS, type Band } from "@/lib/scoring/types";

export function bandFromScore(score: number): Band {
  if (score >= 85) return "Production Ready";
  if (score >= 70) return "Production with Guards";
  if (score >= 45) return "Pilot Only";
  return "Not Ready";
}

export function bandRank(band: Band): number {
  return BANDS.indexOf(band);
}

export function minBand(a: Band, b: Band): Band {
  return bandRank(a) <= bandRank(b) ? a : b;
}

export function bandAtMost(actual: Band, ceiling: Band): boolean {
  return bandRank(actual) <= bandRank(ceiling);
}
