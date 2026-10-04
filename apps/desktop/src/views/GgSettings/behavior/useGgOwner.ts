/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { confirmAction, useKeyedGuard } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { appApi } from '../../../ipc/app-api';
import { lastGuardError } from '../../../keyed-guard/last-guard-error';
import { GG_OWNER_SECRET } from '../../../secrets/secret-names.constants';
import { FORGET_OWNER_CONFIRM } from '../GgSettings.constants';

const useGgOwner = (baseUrl: string) => {
  const [hasOwner, setHasOwner] = useState(false);
  const guarded = useKeyedGuard();
  const { guard, isBusy, clearError } = guarded;

  const check = useCallback(async () => setHasOwner((await secretsApi()?.has(GG_OWNER_SECRET)) ?? false), []);
  useEffect(() => { void check(); }, [check]);

  const act = useCallback((key: string, work: () => Promise<unknown>) => {
    clearError();
    return guard(key, async () => {
      await work();
      await check();
    });
  }, [check, clearError, guard]);

  const openRooms = useCallback(() => { void act('rooms', () => appApi().ggOpenRooms(baseUrl)); }, [act, baseUrl]);
  const resetOwner = useCallback(() => {
    void confirmAction(FORGET_OWNER_CONFIRM).then((confirmed) => {
      if (confirmed) void act('reset', async () => secretsApi()?.delete(GG_OWNER_SECRET));
    });
  }, [act]);

  return { busy: isBusy(), error: lastGuardError(guarded), hasOwner, openRooms, resetOwner };
};

export { useGgOwner };
