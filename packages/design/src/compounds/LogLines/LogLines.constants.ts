/* @layer renderer-app @kind config */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'text', label: 'Text' },
  { id: 'send', label: 'Sent', tone: 'info', toneMessage: true },
  { id: 'hint', label: 'Hint', tone: 'warning', toneMessage: true },
  { id: 'join', label: 'Join', tone: 'success', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { LOG_KINDS };
