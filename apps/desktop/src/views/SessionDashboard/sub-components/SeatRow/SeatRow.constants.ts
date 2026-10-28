/* @layer renderer-app @kind config */
import { defineStatuses } from '@drizztdourden08/tessera/primitives';

const SEAT_STATES = defineStatuses({
  ready: { label: 'Ready', tone: 'success' },
  held: { label: 'Held', tone: 'neutral' },
  checking: { label: 'Checking', tone: 'info', pulse: true },
  refused: { label: 'Refused', tone: 'danger' },
});

export { SEAT_STATES };
