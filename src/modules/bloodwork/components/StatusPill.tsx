import type { Severity } from '../../../core/types';

const SEVERITY_COLOR: Record<Severity, string> = {
  normal: 'var(--status-good)',
  warning: 'var(--status-warning)',
  high: 'var(--status-serious)',
  critical: 'var(--status-critical)',
  low: 'var(--status-low)',
};

export function StatusPill({ label, severity }: { label: string; severity: Severity }) {
  return (
    <span className="status-pill" style={{ background: SEVERITY_COLOR[severity] }}>
      <span className="status-dot" />
      {label}
    </span>
  );
}
