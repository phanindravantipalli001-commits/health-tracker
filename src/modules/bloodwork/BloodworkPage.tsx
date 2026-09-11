import { useEffect, useState, useCallback } from 'react';
import type { TestPanel } from '../../core/types';
import { MARKERS, MARKER_CATEGORIES } from './markers';
import { listPanels, listResultsForMarker, latestResultsByMarker, deletePanel, listResultsForPanel } from './api';
import { MarkerCard } from './components/MarkerCard';
import { AddResultForm } from './components/AddResultForm';
import { PanelHistory } from './components/PanelHistory';

interface MarkerData {
  latest?: { value: number; date: string };
  history: { value: number; date: string }[];
}

export function BloodworkPage() {
  const [panels, setPanels] = useState<TestPanel[]>([]);
  const [resultCounts, setResultCounts] = useState<Map<string, number>>(new Map());
  const [markerData, setMarkerData] = useState<Map<string, MarkerData>>(new Map());
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [panelList, latest] = await Promise.all([listPanels(), latestResultsByMarker()]);
    setPanels(panelList);

    const counts = new Map<string, number>();
    await Promise.all(
      panelList.map(async (p) => {
        const results = await listResultsForPanel(p.id);
        counts.set(p.id, results.length);
      })
    );
    setResultCounts(counts);

    const data = new Map<string, MarkerData>();
    await Promise.all(
      MARKERS.map(async (m) => {
        const history = await listResultsForMarker(m.id);
        const latestForMarker = latest.get(m.id);
        data.set(m.id, {
          latest: latestForMarker ? { value: latestForMarker.value, date: latestForMarker.date } : undefined,
          history: history.map((r) => ({ value: r.value, date: r.date })),
        });
      })
    );
    setMarkerData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(panelId: string) {
    await deletePanel(panelId);
    load();
  }

  if (loading) return null;

  return (
    <div>
      <div className="app-header">
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Bloodwork</h2>
        <button className="primary-button" onClick={() => setShowForm(true)}>
          + Add results
        </button>
      </div>

      {panels.length === 0 ? (
        <div className="empty-state">No results yet. Add your first blood test to see it here.</div>
      ) : (
        MARKER_CATEGORIES.map((category) => (
          <div key={category}>
            <div className="category-heading">{category}</div>
            <div className="category-grid">
              {MARKERS.filter((m) => m.category === category).map((m) => {
                const d = markerData.get(m.id);
                return <MarkerCard key={m.id} marker={m} latest={d?.latest} history={d?.history ?? []} />;
              })}
            </div>
          </div>
        ))
      )}

      {panels.length > 0 && (
        <>
          <div className="section-title">History</div>
          <PanelHistory panels={panels} resultCounts={resultCounts} onDelete={handleDelete} />
        </>
      )}

      {showForm && (
        <AddResultForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}
