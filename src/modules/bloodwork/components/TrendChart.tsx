import { useMemo, useRef, useState } from 'react';
import type { MarkerDefinition, Severity } from '../../../core/types';
import { classifyValue } from '../../../core/types';
import { parseDateOnly, formatDateOnly } from '../../../core/date';

const SEVERITY_COLOR: Record<Severity, string> = {
  normal: 'var(--status-good)',
  warning: 'var(--status-warning)',
  high: 'var(--status-serious)',
  critical: 'var(--status-critical)',
  low: 'var(--status-low)',
};

interface Point {
  date: string;
  value: number;
}

const WIDTH = 480;
const HEIGHT = 160;
const PAD = { top: 12, right: 14, bottom: 22, left: 8 };

export function TrendChart({ marker, points }: { marker: MarkerDefinition; points: Point[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const sorted = useMemo(() => [...points].sort((a, b) => a.date.localeCompare(b.date)), [points]);

  const { xScale, yScale, yMin, yMax } = useMemo(() => {
    const times = sorted.map((p) => parseDateOnly(p.date).getTime());
    const values = sorted.map((p) => p.value);
    const finiteZoneBounds = marker.zones.flatMap((z) => [z.min, z.max]).filter((n): n is number => n !== undefined);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const span = dataMax - dataMin || dataMax || 1;
    let yMin = dataMin - span * 0.25;
    let yMax = dataMax + span * 0.25;
    // Pull in the nearest zone boundaries so bands are visible without exploding the range.
    for (const b of finiteZoneBounds) {
      if (b < dataMin && b > yMin) yMin = b;
      if (b > dataMax && b < yMax) yMax = b;
    }
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }

    const tMin = Math.min(...times);
    const tMax = Math.max(...times);
    const tSpan = tMax - tMin || 1;

    const xScale = (t: number) => PAD.left + ((t - tMin) / tSpan) * (WIDTH - PAD.left - PAD.right);
    const yScale = (v: number) => HEIGHT - PAD.bottom - ((v - yMin) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom);

    return { xScale, yScale, yMin, yMax };
  }, [sorted, marker.zones]);

  if (sorted.length === 0) return null;

  const coords = sorted.map((p) => ({
    x: xScale(parseDateOnly(p.date).getTime()),
    y: yScale(p.value),
    ...p,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  const visibleZones = marker.zones.filter(
    (z) => (z.max === undefined || z.max > yMin) && (z.min === undefined || z.min < yMax)
  );

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let best = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - px);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  };

  const hovered = hoverIdx !== null ? coords[hoverIdx] : null;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return (
    <div className="trend-chart-wrap" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {visibleZones.map((z, i) => {
          const yTop = yScale(z.max ?? yMax);
          const yBottom = yScale(z.min ?? yMin);
          return (
            <rect
              key={i}
              x={PAD.left}
              y={yTop}
              width={WIDTH - PAD.left - PAD.right}
              height={Math.max(0, yBottom - yTop)}
              fill={SEVERITY_COLOR[z.severity]}
              opacity={0.1}
            />
          );
        })}

        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={HEIGHT - PAD.bottom}
          y2={HEIGHT - PAD.bottom}
          stroke="var(--baseline)"
          strokeWidth={1}
        />

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
            stroke="var(--gridline)"
            strokeWidth={1}
          />
        )}

        <path d={linePath} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === hoverIdx ? 5 : 4}
            fill="var(--series-1)"
            stroke="var(--surface-1)"
            strokeWidth={2}
          />
        ))}

        <text x={coords[coords.length - 1].x} y={PAD.top - 2} textAnchor="end" fontSize={11} fill="var(--text-secondary)" fontWeight={600}>
          {last.value}
        </text>

        <text x={PAD.left} y={HEIGHT - 6} fontSize={10} fill="var(--text-muted)">
          {formatDateOnly(first.date)}
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 6} textAnchor="end" fontSize={10} fill="var(--text-muted)">
          {formatDateOnly(last.date)}
        </text>
      </svg>

      {hovered && (
        <div
          className="chart-tooltip"
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: (hovered.y / HEIGHT) * 100 + '%' }}
        >
          {formatDateOnly(hovered.date)} · {hovered.value} {marker.unit} · {classifyValue(marker, hovered.value).label}
        </div>
      )}

      <div className="chart-legend">
        {marker.zones.map((z) => (
          <span className="chart-legend-item" key={z.label}>
            <span className="chart-legend-swatch" style={{ background: SEVERITY_COLOR[z.severity] }} />
            {z.label}
          </span>
        ))}
      </div>
    </div>
  );
}
