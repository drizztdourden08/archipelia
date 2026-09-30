/* @layer renderer-app @kind config */
import type { SessionStatus, SpoilerLevel } from '@archipelia/model';
import type { RunStatusView } from './SessionsLibrary.type';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const LIVE: SessionStatus[] = ['generating', 'starting', 'hosting'];

const STATUS_VIEW: Record<SessionStatus, RunStatusView> = {
  draft: { label: 'draft', tone: 'neutral' },
  generating: { label: 'generating', tone: 'neutral' },
  starting: { label: 'starting', tone: 'neutral' },
  hosting: { label: 'hosting', tone: 'success' },
  stopped: { label: 'stopped', tone: 'warning' },
  failed: { label: 'failed', tone: 'danger' },
};

const SPOILER_LABEL: Record<SpoilerLevel, string> = { 0: 'no spoiler', 1: 'spoiler basic', 2: 'spoiler playthrough', 3: 'spoiler full' };

export { DATE_FORMAT, LIVE, SPOILER_LABEL, STATUS_VIEW };
