/* @layer renderer-app @kind config */
import type { EngineState } from '@archipelia/model';
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';

const BADGES: Record<EngineState | 'unknown', { label: string; variant: BadgeVariant }> = {
  ready: { label: 'Ready', variant: 'success' },
  building: { label: 'Setting up', variant: 'warning' },
  missing: { label: 'Not set up', variant: 'neutral' },
  failed: { label: 'Broken', variant: 'danger' },
  unknown: { label: 'Checking', variant: 'neutral' },
};

export { BADGES };
