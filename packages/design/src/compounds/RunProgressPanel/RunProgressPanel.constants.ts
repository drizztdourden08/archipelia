/* @layer renderer-app @kind config */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const RUN_LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info' },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
];

export { RUN_LOG_KINDS };
