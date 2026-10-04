/* @layer renderer-app @kind config */
import type { SessionStatus } from '@archipelia/model';
import type { RunStatusView } from './RunRow.type';

const RUN_STATUS: Record<SessionStatus, RunStatusView> = {
  draft: { label: 'Draft', tone: 'neutral' },
  generating: { label: 'Generating', tone: 'warning' },
  starting: { label: 'Starting', tone: 'warning' },
  hosting: { label: 'Hosting', tone: 'success' },
  stopped: { label: 'Stopped', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'danger' },
};

export { RUN_STATUS };
