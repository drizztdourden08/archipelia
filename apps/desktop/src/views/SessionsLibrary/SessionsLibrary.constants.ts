/* @layer renderer-app @kind config */
import type { SessionStatus, SpoilerLevel } from '@archipelia/model';
import type { RunStatusView } from './SessionsLibrary.type';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const LIVE: SessionStatus[] = ['generating', 'starting', 'hosting'];

const STATUS_VIEW: Record<SessionStatus, RunStatusView> = {
  draft: { label: 'draft', variant: 'neutral' },
  generating: { label: 'generating', variant: 'neutral' },
  starting: { label: 'starting', variant: 'neutral' },
  hosting: { label: 'hosting', variant: 'success' },
  stopped: { label: 'stopped', variant: 'warning' },
  failed: { label: 'failed', variant: 'danger' },
};

const SPOILER_LABEL: Record<SpoilerLevel, string> = { 0: 'no spoiler', 1: 'spoiler basic', 2: 'spoiler playthrough', 3: 'spoiler full' };

export { DATE_FORMAT, LIVE, SPOILER_LABEL, STATUS_VIEW };
