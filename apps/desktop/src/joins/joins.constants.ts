/* @layer renderer-app @kind config */
import { defineStatuses } from '@drizztdourden08/tessera/primitives';
import type { JoinState } from './joins.type';

const JOIN_STATES = defineStatuses({
  connecting: { label: 'Connecting', tone: 'info', pulse: true },
  pending: { label: 'Waiting for the host', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  started: { label: 'Room open', tone: 'primary' },
  refused: { label: 'Refused', tone: 'danger' },
  failed: { label: 'Failed', tone: 'danger' },
  offline: { label: 'Not connected', tone: 'neutral' },
  ended: { label: 'Ended', tone: 'neutral' },
});

const FINAL_STATES: readonly JoinState[] = ['refused', 'ended'];

const LIVE_STATES: readonly JoinState[] = ['connecting', 'pending', 'approved', 'started'];

export { FINAL_STATES, JOIN_STATES, LIVE_STATES };
