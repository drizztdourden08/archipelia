/* @layer renderer-app @kind config */
import { defineStatuses } from '@drizztdourden08/tessera/primitives';

const CONNECTION_STATUS = defineStatuses({
  idle: { label: 'Not connected', tone: 'neutral' },
  connecting: { label: 'Connecting to the room', tone: 'info', pulse: true },
  live: { label: 'Live', tone: 'success' },
  reconnecting: { label: 'Reconnecting', tone: 'warning', pulse: true },
  closed: { label: 'The room closed the connection', tone: 'neutral' },
  failed: { label: 'Live view failed', tone: 'danger' },
  password: { label: 'This room has a password', tone: 'warning' },
});

const RETRY_PHASES: ReadonlySet<string> = new Set(['reconnecting', 'closed', 'failed']);

export { CONNECTION_STATUS, RETRY_PHASES };
