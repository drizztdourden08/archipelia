/* @layer renderer-app @kind logic */
import { getAppLog } from '@drizztdourden08/brock-react';

const rawOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const logFailure = (sentence: string, err: unknown): void => {
  getAppLog().log('app', `${sentence} ${rawOf(err)}`, 'error');
};

export { logFailure };
