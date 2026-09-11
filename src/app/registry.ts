import type { HealthModule } from './modules';
import { BloodworkPage } from '../modules/bloodwork/BloodworkPage';

// Phase 2+ modules register here — one line each. The shell in App.tsx
// renders nav tabs and the active module purely from this list.
export const MODULES: HealthModule[] = [
  { id: 'bloodwork', label: 'Bloodwork', Component: BloodworkPage },
];
