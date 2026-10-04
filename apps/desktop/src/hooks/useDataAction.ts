/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { lastGuardError } from '../keyed-guard/last-guard-error';

const useDataAction = () => {
  const guarded = useKeyedGuard();
  const { guard, isBusy, clearError } = guarded;
  const [message, setMessage] = useState<string | null>(null);

  const run = useCallback((key: string, work: () => Promise<string | null>) => guard(key, async () => {
    const result = await work();
    clearError();
    setMessage(result);
  }), [clearError, guard]);

  return { busy: isBusy(), message: lastGuardError(guarded) ?? message, run };
};

export { useDataAction };
