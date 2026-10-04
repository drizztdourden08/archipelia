/* @layer renderer-app @kind config */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const CONSOLE_ROW_LIMIT = 200;

const CONSOLE_KINDS: readonly LogKindDef[] = [
  { id: 'command', label: 'Command', tone: 'info', toneMessage: true },
  { id: 'reply', label: 'Reply' },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { CONSOLE_KINDS, CONSOLE_ROW_LIMIT };
