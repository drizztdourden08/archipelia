/* @layer renderer-app @kind config */
import type { HostLogLine } from '@archipelia/hosts';
import type { LogTab, SessionText } from './SessionDashboard.type';

const IDLE: SessionText = { value: null, loading: false };

const TICK_MS = 1000;

const NO_LINES: HostLogLine[] = [];

const GENERATE_LOG = 'generate.log';

const LOG_TAB_LABEL: Record<LogTab, string> = { server: 'Server', generate: 'Generate', spoiler: 'Spoiler' };

const KIND_RULES: readonly [RegExp, string][] = [
  [/\[Hint\]/, 'hint'],
  [/\(Team #\d+\) .+ sent .+ to /, 'send'],
  [/ has (joined|left)/, 'join'],
  [/error|exception|traceback/i, 'error'],
];

const MAX_SENT = 40;

const OUTPUT_DIR = 'output';

export { GENERATE_LOG, IDLE, KIND_RULES, LOG_TAB_LABEL, MAX_SENT, NO_LINES, OUTPUT_DIR, TICK_MS };
