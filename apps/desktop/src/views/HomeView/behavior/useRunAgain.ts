/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { Session } from '@archipelia/model';
import { useRunsStore } from '../../../stores/useRunsStore';

const useRunAgain = (last: Session | null, openSession: (sessionId: string) => void) => {
  const run = useRunsStore((state) => state.run);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgain = useCallback(async () => {
    if (!last) return;
    setBusy(true);
    setError(null);
    try {
      const session = await run(last.snapshot);
      openSession(session.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [last, run, openSession]);

  return useMemo(() => ({ busy, error, runAgain }), [busy, error, runAgain]);
};

export { useRunAgain };
