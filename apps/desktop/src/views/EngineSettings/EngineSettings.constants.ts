/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineState } from '@archipelia/model';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

const STATE_VIEW: Record<EngineState | 'unknown', { label: string; tone: StatusTone }> = {
  ready: { label: 'Ready', tone: 'success' },
  building: { label: 'Setting up', tone: 'warning' },
  missing: { label: 'Not set up', tone: 'neutral' },
  failed: { label: 'Broken', tone: 'danger' },
  unknown: { label: 'Checking', tone: 'neutral' },
};

const REBUILD_CONFIRM: ConfirmActionOptions = {
  title: 'Rebuild the engine',
  message: 'The engine is removed and downloaded again, about 90 MB.',
  confirmLabel: 'Rebuild',
  variant: 'danger',
  focus: 'cancel',
};

export { REBUILD_CONFIRM, STATE_VIEW };
