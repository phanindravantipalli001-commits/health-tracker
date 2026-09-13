# OriVane Health

One health record that grows with you. OriVane starts with the numbers your
lab reports give you — vitamin deficiencies, diabetes markers — and adds a new
piece of your health picture every phase, so what begins as a bloodwork log
becomes the single place your health history lives over time.

A local-first app: all data is stored in the browser (IndexedDB) — nothing
leaves the device, no accounts.

## Phase 1: Bloodwork

Track vitamin/mineral deficiencies and diabetes markers over time:
- Log a blood draw and enter values for any tracked marker
- Dashboard shows the latest value per marker with a status badge
  (deficient / normal / prediabetes range / etc.)
- Trend chart per marker with the reference-range bands drawn behind the line

## Architecture (why adding phase 2+ stays easy)

- `src/core/` — shared types, the IndexedDB schema (`db.ts`), date helpers.
  New tables for a future phase are added here, behind the same
  repository pattern already used by the bloodwork module.
- `src/modules/<name>/` — one folder per feature area. Each module owns its
  own data (`markers.ts`-style registry), its own `api.ts` (all reads/writes
  for that module), and its own components. A module never reaches into
  another module's tables directly.
- `src/app/registry.ts` — the single place that lists which modules exist.
  Adding a phase 2 module (e.g. medications, symptoms, vitals) means: create
  `src/modules/<new>/`, then add one line here. The nav and page switching in
  `App.tsx` need no changes.
- **Marker registry pattern**: `src/modules/bloodwork/markers.ts` defines
  markers declaratively — id, unit, and ordered severity "zones" (e.g.
  Deficient / Insufficient / Normal / High). Adding a new blood marker, or a
  whole new panel (lipids, thyroid, etc.), is adding entries to this file —
  no logic changes needed in the dashboard, form, or chart.

## Development

```bash
npm install
npm run dev
```

## Reference ranges disclaimer

Ranges shown are general adult ranges for orientation only, not medical
advice. Always defer to your lab's printed reference range and your
doctor's interpretation.
