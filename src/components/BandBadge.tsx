import type { Band } from "@/lib/scoring/types";

/** Theme-aware badges — colors come from CSS variables so light/dark both read. */
const STYLES: Record<Band, string> = {
  "Not Ready":
    "bg-[color-mix(in_srgb,var(--danger)_16%,transparent)] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_40%,transparent)]",
  "Pilot Only":
    "bg-[color-mix(in_srgb,var(--warn)_16%,transparent)] text-[var(--warn)] border-[color-mix(in_srgb,var(--warn)_40%,transparent)]",
  "Production with Guards":
    "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)]",
  "Production Ready":
    "bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_50%,transparent)]",
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
