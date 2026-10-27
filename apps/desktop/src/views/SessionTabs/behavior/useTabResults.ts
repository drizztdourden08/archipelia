/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { Session } from '@archipelia/model';
import { useRunAgainOf } from '../../../hooks/useRunAgainOf';

const useTabResults = (run: Session) => {
  const again = useRunAgainOf();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgain = useCallback(() => {
    setBusy(true);
    setError(null);
    again(run).catch((err: Error) => setError(err.message)).finally(() => setBusy(false));
  }, [again, run]);

  return { busy, error, runAgain };
};

export { useTabResults };
