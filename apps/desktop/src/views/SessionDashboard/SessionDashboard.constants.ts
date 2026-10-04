/* @layer renderer-app @kind config */
import type { HostLogLine } from '@archipelia/hosts';
import type { SessionStatus } from '@archipelia/model';
import type { LogTab, SessionText, StatusView } from './SessionDashboard.type';

const IDLE: SessionText = { value: null, loading: false };

const TICK_MS = 1000;

const NO_LINES: HostLogLine[] = [];

const STATUS_VIEW: Record<SessionStatus, StatusView> = {
  draft: { label: 'DRAFT', tone: 'neutral' },
  generating: { label: 'GENERATING', tone: 'warning' },
  starting: { label: 'STARTING', tone: 'warning' },
  hosting: { label: 'HOSTING', tone: 'success' },
  stopped: { label: 'STOPPED', tone: 'neutral' },
  failed: { label: 'FAILED', tone: 'danger' },
};

const GENERATE_LOG = 'generate.log';

const LOG_TAB_LABEL: Record<LogTab, string> = { server: 'Server', generate: 'Generate', spoiler: 'Spoiler' };

const KIND_RULES: readonly [RegExp, string][] = [
  [/\[Hint\]/, 'hint'],
  [/\(Team #\d+\) .+ sent .+ to /, 'send'],
  [/ has (joined|left)/, 'join'],
  [/error|exception|traceback/i, 'error'],
];

const MAX_SENT = 40;

export { GENERATE_LOG, IDLE, KIND_RULES, LOG_TAB_LABEL, MAX_SENT, NO_LINES, STATUS_VIEW, TICK_MS };
