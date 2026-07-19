import type { Band } from "@/lib/scoring/types";

const CLASS: Record<Band, string> = {
  "Not Ready": "band-badge--not-ready",
  "Pilot Only": "band-badge--pilot",
  "Production with Guards": "band-badge--guards",
  "Production Ready": "band-badge--ready",
};

export function BandBadge({ band }: { band: Band }) {
  return <span className={`band-badge ${CLASS[band]}`}>{band}</span>;
}
