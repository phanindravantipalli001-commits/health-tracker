import type { ComponentType } from 'react';

// The module registry is the extension point for every future phase.
// A new phase (e.g. medications, symptoms journal, vitals) exports a
// HealthModule from its own folder and adds one line to registry.ts —
// the shell (nav + routing) never needs to change.
export interface HealthModule {
  id: string;
  label: string;
  Component: ComponentType;
}
