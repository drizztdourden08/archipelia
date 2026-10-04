/* @layer renderer-app @kind config */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { PlayerStatus } from '@archipelia/sessions/live-room';

const STATUS_TONE: Record<PlayerStatus, StatusTone> = {
  unknown: 'neutral',
  offline: 'danger',
  connected: 'neutral',
  ready: 'warning',
  playing: 'success',
  goal: 'success',
};

export { STATUS_TONE };
