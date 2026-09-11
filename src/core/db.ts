import Dexie, { type Table } from 'dexie';
import type { TestPanel, TestResult } from './types';

// Local-first storage: everything lives in the browser's IndexedDB.
// Later phases add tables here (e.g. medications, symptoms) behind the
// same repository pattern used in modules/bloodwork/api.ts, so swapping
// this file for a cloud-backed implementation later touches nothing else.
class HealthTrackerDB extends Dexie {
  panels!: Table<TestPanel, string>;
  results!: Table<TestResult, string>;

  constructor() {
    super('health-tracker');
    this.version(1).stores({
      panels: 'id, date',
      results: 'id, panelId, markerId',
    });
  }
}

export const db = new HealthTrackerDB();
