/* @layer renderer-app @kind config */
import type { HostLogLine } from '@archipelia/hosts';
import type { LogTab, SessionText } from './SessionDashboard.type';

const IDLE: SessionText = { value: null, loading: false, failed: false };

const TICK_MS = 1000;

const NO_LINES: HostLogLine[] = [];

const GENERATE_LOG = 'generate.log';

const LOG_TAB_LABEL: Record<LogTab, string> = { server: 'Server', generate: 'Generate' };

const LOG_TABS: readonly LogTab[] = ['server', 'generate'];

const LOG_TAB_ITEMS = LOG_TABS.map((id) => ({ id, label: LOG_TAB_LABEL[id] }));

const KIND_RULES: readonly [RegExp, string][] = [
  [/\[Hint\]/, 'hint'],
  [/\(Team #\d+\) .+ sent .+ to /, 'send'],
  [/ has (joined|left)/, 'join'],
  [/error|exception|traceback/i, 'error'],
];

const MAX_SENT = 40;

const OUTPUT_DIR = 'output';

const READ_FAILED = 'Could not read this file.';

const FAILURE = {
  stop: 'Could not stop the room.',
  copy: 'Could not copy the address.',
  run: 'This run did not get its room up. Show log on the Sessions page has the details.',
} as const;

export { FAILURE, GENERATE_LOG, IDLE, KIND_RULES, LOG_TAB_ITEMS, LOG_TABS, MAX_SENT, NO_LINES, OUTPUT_DIR, READ_FAILED, TICK_MS };
