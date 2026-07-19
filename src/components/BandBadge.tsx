import type { Band } from "@/lib/scoring/types";

const STYLES: Record<Band, string> = {
  "Not Ready": "bg-[rgba(196,92,92,0.2)] text-[#f0b4b4] border-[rgba(196,92,92,0.45)]",
  "Pilot Only": "bg-[rgba(212,160,23,0.18)] text-[#f0d48a] border-[rgba(212,160,23,0.45)]",
  "Production with Guards":
    "bg-[rgba(61,154,139,0.18)] text-[#a8e0d6] border-[rgba(61,154,139,0.45)]",
  "Production Ready":
    "bg-[rgba(90,170,110,0.2)] text-[#b8e6c2] border-[rgba(90,170,110,0.45)]",
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
