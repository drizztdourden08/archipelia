/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import { CLEAN_DAYS } from '../OldRuns.constants';

const cleanRunsConfirm = (count: number): ConfirmActionOptions => ({
  title: 'Remove old runs',
  message: `Delete ${count} ${count === 1 ? 'run' : 'runs'} older than ${CLEAN_DAYS} days and their output files? This cannot be undone.`,
  confirmLabel: 'Delete',
  variant: 'danger',
});

export { cleanRunsConfirm };
