/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';

const useKeyedGuard = () => {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guard = useCallback(async (key: string, work: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await work();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }, []);

  return { busy, error, guard };
};

export { useKeyedGuard };
