/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from './fail-with';
import { failureOf } from './failure-of';

const useActionGuard = (failures: Readonly<Record<string, string>>) => {
  const { guard: keyed, isBusy, clearError, lastError } = useKeyedGuard();
  const guard = useCallback((key: string, work: () => Promise<unknown>) => {
    clearError();
    return keyed(key, failWith(failureOf(failures)(key), work));
  }, [clearError, failures, keyed]);
  return { guard, busy: isBusy(), error: lastError };
};

export { useActionGuard };
