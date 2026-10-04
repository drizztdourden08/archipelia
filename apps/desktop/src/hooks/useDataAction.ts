/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from './fail-with';

const useDataAction = () => {
  const { guard, isBusy, lastError } = useKeyedGuard();
  const [message, setMessage] = useState<string | null>(null);

  const run = useCallback((key: string, failure: string, work: () => Promise<string | null>) => {
    setMessage(null);
    return guard(key, failWith(failure, async () => setMessage(await work())));
  }, [guard]);

  return { busy: isBusy(), error: lastError, message, run };
};

export { useDataAction };
