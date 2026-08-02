import type { Band } from "@/lib/scoring/types";

type RadarDimension = {
  dimensionId: string;
  name: string;
  score: number;
  band?: Band;
};

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 88;
const RINGS = [25, 50, 75, 100];

function point(index: number, count: number, fraction: number) {
  const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
  const r = RADIUS * fraction;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

function polygon(count: number, fraction: number, valueAt?: (i: number) => number) {
  return Array.from({ length: count }, (_, i) => {
    const f = valueAt ? valueAt(i) : fraction;
    const p = point(i, count, f);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

/**
 * Dependency-free SVG radar of dimension scores (0-100).
 * Presentational and static (reduced-motion safe). Tabular score labels at each axis.
 */
export function ScoreRadar({ dimensions }: { dimensions: RadarDimension[] }) {
  const count = dimensions.length;
  if (count < 3) return null;

  const clamp = (n: number) => Math.max(0, Math.min(100, n)) / 100;
  const dataPoints = polygon(count, 0, (i) => clamp(dimensions[i].score));
  const summary = dimensions
    .map((d) => `${d.dimensionId} ${Math.round(d.score)}`)
    .join(", ");

  return (
    <figure className="score-radar m-0 flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        className="max-w-[300px]"
        role="img"
        aria-label={`Dimension score radar. ${summary}.`}
      >
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={polygon(count, ring / 100)}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={ring === 100 ? 1.25 : 1}
            opacity={ring === 100 ? 0.95 : 0.55}
          />
        ))}

        {dimensions.map((dim, i) => {
          const outer = point(i, count, 1);
          const label = point(i, count, 1.22);
          const scorePos = point(i, count, 1.38);
          return (
            <g key={dim.dimensionId}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--border-strong)"
                strokeWidth={1}
                opacity={0.55}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--foreground)"
              >
                {dim.dimensionId}
              </text>
              <text
                x={scorePos.x}
                y={scorePos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="var(--muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {Math.round(dim.score)}
              </text>
            </g>
          );
        })}

        <polygon
          className="score-radar-data"
          points={dataPoints}
          fill="var(--accent)"
          fillOpacity={0.2}
          stroke="var(--accent)"
          strokeWidth={2.25}
        />
        {dimensions.map((dim, i) => {
          const p = point(i, count, clamp(dim.score));
          return (
            <circle
              key={dim.dimensionId}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="var(--accent)"
              stroke="var(--card)"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </figure>
  );
}
