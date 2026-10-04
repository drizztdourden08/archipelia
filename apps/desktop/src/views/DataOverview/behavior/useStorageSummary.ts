/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { requireHostApi } from '@drizztdourden08/brock-react';
import type { StorageSummary } from '@drizztdourden08/brock-core/platform';

const useStorageSummary = () => {
  const [summary, setSummary] = useState<StorageSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setSummary(await requireHostApi().getStorageSummary());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const retry = useCallback(() => { void load(); }, [load]);
  const reveal = useCallback(() => { void requireHostApi().revealDataFolder(); }, []);

  return { error, retry, reveal, summary };
};

export { useStorageSummary };
