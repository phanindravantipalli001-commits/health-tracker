import { useState } from 'react';
import type { MarkerDefinition } from '../../../core/types';
import { classifyValue } from '../../../core/types';
import { formatDateOnly } from '../../../core/date';
import { StatusPill } from './StatusPill';
import { TrendChart } from './TrendChart';

interface Props {
  marker: MarkerDefinition;
  latest?: { value: number; date: string };
  history: { value: number; date: string }[];
}

export function MarkerCard({ marker, latest, history }: Props) {
  const [expanded, setExpanded] = useState(false);
  const zone = latest ? classifyValue(marker, latest.value) : null;

  return (
    <div className="marker-card">
      <div className="marker-card-header">
        <div className="marker-name">{marker.name}</div>
        {zone && <StatusPill label={zone.label} severity={zone.severity} />}
      </div>

      {latest ? (
        <>
          <div className="marker-value-row">
            <span className="marker-value">{latest.value}</span>
            <span className="marker-unit">{marker.unit}</span>
          </div>
          <div className="marker-date">as of {formatDateOnly(latest.date)}</div>

          {history.length > 1 && (
            <button className="expand-toggle" onClick={() => setExpanded((e) => !e)}>
              {expanded ? 'Hide trend' : `View trend (${history.length} results)`}
            </button>
          )}
          {expanded && <TrendChart marker={marker} points={history} />}
        </>
      ) : (
        <div className="marker-empty">No results yet</div>
      )}
    </div>
  );
}
