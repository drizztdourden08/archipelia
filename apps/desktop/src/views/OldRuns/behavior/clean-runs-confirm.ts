/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import { CLEAN_DAYS } from '../OldRuns.constants';

const cleanRunsConfirm = (count: number): ConfirmDeleteOptions => ({
  what: `${count} ${count === 1 ? 'run' : 'runs'} older than ${CLEAN_DAYS} days`,
  consequence: 'Their output files go with them. This cannot be undone.',
});

export { cleanRunsConfirm };
