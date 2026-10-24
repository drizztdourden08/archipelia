/* @layer renderer-app @kind config */
import { defineStatuses } from '@drizztdourden08/tessera/primitives';

const LOBBY_PHASES = defineStatuses({
  open: { label: 'Open', tone: 'success' },
  locked: { label: 'Locked', tone: 'warning' },
  generating: { label: 'Generating', tone: 'info', pulse: true },
  hosting: { label: 'Hosting', tone: 'primary' },
  closed: { label: 'Closed', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'danger' },
});

const MEMBER_ADMISSIONS = defineStatuses({
  pending: { label: 'Waiting for you', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  refused: { label: 'Refused', tone: 'danger' },
  removed: { label: 'Removed', tone: 'neutral' },
});

const SLOT_STATES = defineStatuses({
  uploading: { label: 'Sending files', tone: 'info', pulse: true },
  checking: { label: 'Checking', tone: 'info', pulse: true },
  'waiting-consent': { label: 'Needs your consent', tone: 'warning' },
  ok: { label: 'Ready', tone: 'success' },
  refused: { label: 'Refused', tone: 'danger' },
});

const SERVER_STATES = defineStatuses({
  starting: { label: 'Starting', tone: 'info', pulse: true },
  listening: { label: 'Listening', tone: 'success' },
  failed: { label: 'Not running', tone: 'danger' },
});

export { LOBBY_PHASES, MEMBER_ADMISSIONS, SERVER_STATES, SLOT_STATES };
