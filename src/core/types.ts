// Shared types for the health tracker's data layer.
// Every phase's markers plug into this same shape, so new marker types
// (new panels, new categories) never require touching module code.

export type Severity = 'low' | 'normal' | 'warning' | 'high' | 'critical';

/** One band of a marker's reference range, e.g. "Prediabetes: 100-125 mg/dL". */
export interface Zone {
  label: string;
  severity: Severity;
  /** inclusive lower bound; omit for -Infinity */
  min?: number;
  /** exclusive upper bound; omit for +Infinity */
  max?: number;
}

export interface MarkerDefinition {
  id: string;
  name: string;
  category: string;
  unit: string;
  /** short note on what the marker measures */
  description?: string;
  /** ascending, non-overlapping bands used to classify a value */
  zones: Zone[];
}

export interface TestPanel {
  id: string;
  date: string; // ISO date (yyyy-mm-dd)
  labName?: string;
  notes?: string;
  createdAt: string; // ISO datetime
}

export interface TestResult {
  id: string;
  panelId: string;
  markerId: string;
  value: number;
}

export function classifyValue(marker: MarkerDefinition, value: number): Zone {
  const zone = marker.zones.find(
    (z) => (z.min === undefined || value >= z.min) && (z.max === undefined || value < z.max)
  );
  return zone ?? { label: 'Unknown', severity: 'normal' };
}
