/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { Session } from '@archipelia/model';
import { useRunAgainOf } from '../../../hooks/useRunAgainOf';

const useRunAgain = (last: Session | null) => {
  const again = useRunAgainOf();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgain = useCallback(async () => {
    if (!last) return;
    setBusy(true);
    setError(null);
    try {
      await again(last);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [again, last]);

  return useMemo(() => ({ busy, error, runAgain }), [busy, error, runAgain]);
};

export { useRunAgain };
