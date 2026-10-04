/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const runSummary = (run: Session): string => (run.status === 'hosting'
  ? `the run ${run.seed ?? ''} hosts at ${run.endpoint?.host ?? ''}:${run.endpoint?.port ?? ''}`
  : `the run ended ${run.status}: ${run.error ?? 'no error'}`);

export { runSummary };
