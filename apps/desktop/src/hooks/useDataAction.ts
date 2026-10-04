/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';

const useDataAction = () => {
  const { guard, isBusy, clearError, lastError } = useKeyedGuard();
  const [message, setMessage] = useState<string | null>(null);

  const run = useCallback((key: string, work: () => Promise<string | null>) => guard(key, async () => {
    const result = await work();
    clearError();
    setMessage(result);
  }), [clearError, guard]);

  return { busy: isBusy(), message: lastError ?? message, run };
};

export { useDataAction };
