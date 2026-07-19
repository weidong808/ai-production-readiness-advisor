import type { Band } from "@/lib/scoring/types";

const STYLES: Record<Band, string> = {
  "Not Ready": "bg-[rgba(196,92,92,0.2)] text-[#f0b4b4] border-[rgba(196,92,92,0.45)]",
  "Pilot Only": "bg-[rgba(212,160,23,0.18)] text-[#f0d48a] border-[rgba(212,160,23,0.45)]",
  "Production with Guards":
    "bg-[rgba(62,207,142,0.16)] text-[#a8efc8] border-[rgba(62,207,142,0.4)]",
  "Production Ready":
    "bg-[rgba(62,207,142,0.22)] text-[#c4f5d8] border-[rgba(62,207,142,0.5)]",
};

export function BandBadge({ band }: { band: Band }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide ${STYLES[band]}`}
    >
      {band}
    </span>
  );
}
