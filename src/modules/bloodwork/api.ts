import { db } from '../../core/db';
import type { TestPanel, TestResult } from '../../core/types';

// All reads/writes for the bloodwork module go through this file. Later
// phases follow the same pattern (one api.ts per module) so storage details
// never leak into components.

export async function listPanels(): Promise<TestPanel[]> {
  return db.panels.orderBy('date').reverse().toArray();
}

export async function listResultsForPanel(panelId: string): Promise<TestResult[]> {
  return db.results.where('panelId').equals(panelId).toArray();
}

export async function listResultsForMarker(markerId: string): Promise<(TestResult & { date: string })[]> {
  const results = await db.results.where('markerId').equals(markerId).toArray();
  const panels = await db.panels.toArray();
  const panelDates = new Map(panels.map((p) => [p.id, p.date]));
  return results
    .map((r) => ({ ...r, date: panelDates.get(r.panelId) ?? '' }))
    .filter((r) => r.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function latestResultsByMarker(): Promise<Map<string, TestResult & { date: string }>> {
  const panels = await db.panels.toArray();
  const results = await db.results.toArray();
  const panelDates = new Map(panels.map((p) => [p.id, p.date]));

  const latest = new Map<string, TestResult & { date: string }>();
  for (const r of results) {
    const date = panelDates.get(r.panelId);
    if (!date) continue;
    const existing = latest.get(r.markerId);
    if (!existing || date > existing.date) {
      latest.set(r.markerId, { ...r, date });
    }
  }
  return latest;
}

export async function addPanel(
  panel: Omit<TestPanel, 'id' | 'createdAt'>,
  values: { markerId: string; value: number }[]
): Promise<string> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await db.transaction('rw', db.panels, db.results, async () => {
    await db.panels.add({ ...panel, id, createdAt });
    await db.results.bulkAdd(
      values.map((v) => ({
        id: crypto.randomUUID(),
        panelId: id,
        markerId: v.markerId,
        value: v.value,
      }))
    );
  });

  return id;
}

export async function deletePanel(panelId: string): Promise<void> {
  await db.transaction('rw', db.panels, db.results, async () => {
    await db.results.where('panelId').equals(panelId).delete();
    await db.panels.delete(panelId);
  });
}
