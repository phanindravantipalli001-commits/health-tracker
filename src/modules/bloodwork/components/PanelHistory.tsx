import type { TestPanel } from '../../../core/types';
import { formatDateOnly } from '../../../core/date';

interface Props {
  panels: TestPanel[];
  resultCounts: Map<string, number>;
  onDelete: (panelId: string) => void;
}

export function PanelHistory({ panels, resultCounts, onDelete }: Props) {
  if (panels.length === 0) return null;

  return (
    <div className="history-list">
      {panels.map((p) => (
        <div className="history-row" key={p.id}>
          <div>
            <div className="history-row-main">{formatDateOnly(p.date, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="history-row-sub">
              {resultCounts.get(p.id) ?? 0} marker{(resultCounts.get(p.id) ?? 0) === 1 ? '' : 's'}
              {p.labName ? ` · ${p.labName}` : ''}
            </div>
          </div>
          <button className="icon-button" onClick={() => onDelete(p.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
