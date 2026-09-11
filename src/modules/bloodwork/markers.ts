import type { MarkerDefinition } from '../../core/types';

// Marker registry: adding a new blood marker in a later phase (e.g. a lipid
// panel or thyroid panel) means adding an entry here — no other code changes.
// Ranges are general adult reference ranges for orientation only; a specific
// lab's printed range should always take precedence.

export const MARKER_CATEGORIES = ['Vitamins & Minerals', 'Diabetes & Metabolic'] as const;

export const MARKERS: MarkerDefinition[] = [
  {
    id: 'vitamin-d',
    name: 'Vitamin D (25-OH)',
    category: 'Vitamins & Minerals',
    unit: 'ng/mL',
    description: 'Deficiency is linked to bone, muscle, and immune issues.',
    zones: [
      { label: 'Deficient', severity: 'critical', max: 20 },
      { label: 'Insufficient', severity: 'warning', min: 20, max: 30 },
      { label: 'Normal', severity: 'normal', min: 30, max: 100 },
      { label: 'High', severity: 'high', min: 100 },
    ],
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'Vitamins & Minerals',
    unit: 'pg/mL',
    description: 'Low levels can cause fatigue, anemia, and nerve issues.',
    zones: [
      { label: 'Deficient', severity: 'critical', max: 200 },
      { label: 'Borderline', severity: 'warning', min: 200, max: 300 },
      { label: 'Normal', severity: 'normal', min: 300, max: 900 },
      { label: 'High', severity: 'high', min: 900 },
    ],
  },
  {
    id: 'folate',
    name: 'Folate (Vitamin B9)',
    category: 'Vitamins & Minerals',
    unit: 'ng/mL',
    zones: [
      { label: 'Deficient', severity: 'critical', max: 2.7 },
      { label: 'Normal', severity: 'normal', min: 2.7, max: 17 },
      { label: 'High', severity: 'high', min: 17 },
    ],
  },
  {
    id: 'ferritin',
    name: 'Ferritin',
    category: 'Vitamins & Minerals',
    unit: 'ng/mL',
    description: 'Reflects iron stores; ranges vary notably by sex.',
    zones: [
      { label: 'Low', severity: 'critical', max: 20 },
      { label: 'Normal', severity: 'normal', min: 20, max: 250 },
      { label: 'High', severity: 'high', min: 250 },
    ],
  },
  {
    id: 'iron',
    name: 'Iron (Serum)',
    category: 'Vitamins & Minerals',
    unit: 'µg/dL',
    zones: [
      { label: 'Low', severity: 'critical', max: 60 },
      { label: 'Normal', severity: 'normal', min: 60, max: 170 },
      { label: 'High', severity: 'high', min: 170 },
    ],
  },
  {
    id: 'fasting-glucose',
    name: 'Fasting Glucose',
    category: 'Diabetes & Metabolic',
    unit: 'mg/dL',
    zones: [
      { label: 'Low', severity: 'critical', max: 70 },
      { label: 'Normal', severity: 'normal', min: 70, max: 100 },
      { label: 'Prediabetes range', severity: 'warning', min: 100, max: 126 },
      { label: 'Diabetes range', severity: 'critical', min: 126 },
    ],
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'Diabetes & Metabolic',
    unit: '%',
    description: 'Reflects average blood sugar over ~3 months.',
    zones: [
      { label: 'Normal', severity: 'normal', max: 5.7 },
      { label: 'Prediabetes range', severity: 'warning', min: 5.7, max: 6.5 },
      { label: 'Diabetes range', severity: 'critical', min: 6.5 },
    ],
  },
  {
    id: 'fasting-insulin',
    name: 'Fasting Insulin',
    category: 'Diabetes & Metabolic',
    unit: 'µIU/mL',
    zones: [
      { label: 'Low', severity: 'low', max: 2.6 },
      { label: 'Normal', severity: 'normal', min: 2.6, max: 25 },
      { label: 'High (insulin resistance signal)', severity: 'warning', min: 25 },
    ],
  },
];

export function getMarker(id: string): MarkerDefinition | undefined {
  return MARKERS.find((m) => m.id === id);
}
