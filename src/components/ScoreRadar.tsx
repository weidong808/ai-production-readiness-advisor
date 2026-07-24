import type { Band } from "@/lib/scoring/types";

type RadarDimension = {
  dimensionId: string;
  name: string;
  score: number;
  band?: Band;
};

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 92;
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
 * Dependency-free SVG radar of dimension scores (0-100). Purely presentational
 * and static, so it needs no motion handling. Falls back to nothing when there
 * are too few axes to form a polygon.
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
    <figure className="m-0 flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        className="max-w-[280px]"
        role="img"
        aria-label={`Dimension score radar. ${summary}.`}
      >
        {/* grid rings */}
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={polygon(count, ring / 100)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={ring === 100 ? 0.9 : 0.5}
          />
        ))}

        {/* axes + labels */}
        {dimensions.map((dim, i) => {
          const outer = point(i, count, 1);
          const label = point(i, count, 1.16);
          return (
            <g key={dim.dimensionId}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--border)"
                strokeWidth={1}
                opacity={0.5}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--muted)"
              >
                {dim.dimensionId}
              </text>
            </g>
          );
        })}

        {/* data polygon */}
        <polygon
          points={dataPoints}
          fill="var(--accent)"
          fillOpacity={0.18}
          stroke="var(--accent)"
          strokeWidth={2}
        />
        {dimensions.map((dim, i) => {
          const p = point(i, count, clamp(dim.score));
          return (
            <circle
              key={dim.dimensionId}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill="var(--accent)"
            />
          );
        })}
      </svg>
    </figure>
  );
}
