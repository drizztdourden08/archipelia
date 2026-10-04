/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineState } from '@archipelia/model';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

const STATE_VIEW: Record<EngineState | 'unknown', { label: string; tone: StatusTone }> = {
  ready: { label: 'Ready', tone: 'success' },
  building: { label: 'Setting up', tone: 'warning' },
  missing: { label: 'Not set up', tone: 'neutral' },
  failed: { label: 'Setup failed', tone: 'danger' },
  unknown: { label: 'Checking', tone: 'neutral' },
};

const REBUILD_CONFIRM: ConfirmActionOptions = {
  title: 'Rebuild the engine',
  message: 'The engine is removed and downloaded again, about 90 MB.',
  confirmLabel: 'Rebuild',
  variant: 'danger',
};

const FAILURE = {
  setup: 'The engine setup failed. Set up engine tries again.',
  open: 'Could not open the engine folder.',
} as const;

const STARTING_STEP = 'Starting';

export { FAILURE, REBUILD_CONFIRM, STARTING_STEP, STATE_VIEW };
