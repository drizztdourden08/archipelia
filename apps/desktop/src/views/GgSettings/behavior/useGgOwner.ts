/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { appApi } from '../../../ipc/app-api';
import { GG_OWNER_SECRET } from '../../../secrets/secret-names.constants';

const useGgOwner = (baseUrl: string) => {
  const [hasOwner, setHasOwner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => setHasOwner((await secretsApi()?.has(GG_OWNER_SECRET)) ?? false), []);
  useEffect(() => { void check(); }, [check]);

  const guard = useCallback(async (work: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await work();
      await check();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [check]);

  const openRooms = useCallback(() => { void guard(() => appApi().ggOpenRooms(baseUrl)); }, [guard, baseUrl]);
  const resetOwner = useCallback(() => { void guard(async () => secretsApi()?.delete(GG_OWNER_SECRET)); }, [guard]);

  return { busy, error, hasOwner, openRooms, resetOwner };
};

export { useGgOwner };
