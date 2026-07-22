import { BandBadge } from "@/components/BandBadge";
import type { Band } from "@/lib/scoring/types";

const PREVIEW_BAND: Band = "Production with Guards";
const PREVIEW_SCORE = 86;
const PREVIEW_DIMS: { id: string; name: string; score: number; band: Band }[] =
  [
    {
      id: "D7",
      name: "Human oversight",
      score: 67,
      band: "Pilot Only",
    },
    {
      id: "D3",
      name: "Evaluation quality",
      score: 83,
      band: "Production with Guards",
    },
    {
      id: "D1",
      name: "Use-case & risk fit",
      score: 92,
      band: "Production Ready",
    },
  ];

export function LandingPreview() {
  return (
    <div className="ui-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <BandBadge band={PREVIEW_BAND} />
        <span className="text-sm text-[var(--muted)]">
          Overall score {PREVIEW_SCORE}
        </span>
      </div>
      <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,var(--warn)_40%,transparent)] bg-[color-mix(in_srgb,var(--warn)_12%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--warn)]">
        HG-09 · ceiling {PREVIEW_BAND}
      </p>
      <div className="mt-4 space-y-2">
        {PREVIEW_DIMS.map((dim) => (
          <div
            key={dim.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
          >
            <span className="text-xs font-semibold text-[var(--accent)]">
              {dim.id}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {dim.name}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  role="meter"
                  aria-label={`${dim.name} score`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={dim.score}
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold">{dim.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
