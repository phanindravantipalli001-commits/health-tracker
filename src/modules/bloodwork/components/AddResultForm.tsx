import { useState } from 'react';
import { MARKERS, MARKER_CATEGORIES } from '../markers';
import { addPanel } from '../api';

export function AddResultForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [labName, setLabName] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filledCount = Object.values(values).filter((v) => v.trim() !== '').length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const entries = Object.entries(values)
      .filter(([, v]) => v.trim() !== '')
      .map(([markerId, v]) => ({ markerId, value: Number(v) }));

    if (entries.length === 0) {
      setError('Enter at least one marker value.');
      return;
    }
    if (entries.some((e) => Number.isNaN(e.value))) {
      setError('One of the values is not a valid number.');
      return;
    }

    setSaving(true);
    try {
      await addPanel({ date, labName: labName.trim() || undefined }, entries);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add blood test results</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="date">Draw date</label>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="lab">Lab (optional)</label>
              <input id="lab" type="text" value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="Quest, LabCorp, ..." />
            </div>
          </div>

          {MARKER_CATEGORIES.map((category) => (
            <div key={category}>
              <div className="category-heading">{category}</div>
              {MARKERS.filter((m) => m.category === category).map((m) => (
                <div className="result-input-row" key={m.id}>
                  <label htmlFor={m.id}>{m.name}</label>
                  <input
                    id={m.id}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={values[m.id] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [m.id]: e.target.value }))}
                    placeholder="value"
                  />
                  <span className="result-unit">{m.unit}</span>
                </div>
              ))}
            </div>
          ))}

          {error && <div style={{ color: 'var(--status-critical)', fontSize: '0.85rem', marginTop: 10 }}>{error}</div>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Saving...' : `Save${filledCount ? ` (${filledCount})` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
