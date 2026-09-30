/* @layer renderer-app @kind config */
import type { EngineState } from '@archipelia/model';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

const STATE_VIEW: Record<EngineState | 'unknown', { label: string; tone: StatusTone }> = {
  ready: { label: 'Ready', tone: 'success' },
  building: { label: 'Setting up', tone: 'warning' },
  missing: { label: 'Not set up', tone: 'neutral' },
  failed: { label: 'Broken', tone: 'danger' },
  unknown: { label: 'Checking', tone: 'neutral' },
};

export { STATE_VIEW };
