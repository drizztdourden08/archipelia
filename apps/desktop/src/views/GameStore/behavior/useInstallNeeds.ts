/* @layer renderer-app @kind hook */
import { isAppError } from '@drizztdourden08/brock-core/ipc';
import { useCallback, useState } from 'react';
import { INSTALL_FAILURE_CODE, installFailureFrom } from '@archipelia/model';
import type { InstallFailure } from '@archipelia/model';
import type { InstallNeeds } from './useInstallNeeds.type';

const without = (needs: InstallNeeds, key: string): InstallNeeds => Object.fromEntries(Object.entries(needs).filter(([found]) => found !== key));

const useInstallNeeds = () => {
  const [needs, setNeeds] = useState<InstallNeeds>({});

  const needOf = useCallback((key: string): InstallFailure | undefined => needs[key], [needs]);

  const track = useCallback(<T,>(key: string, work: () => Promise<T>) => async (): Promise<T> => {
    setNeeds((current) => without(current, key));
    try {
      return await work();
    } catch (err) {
      const need = isAppError(err, INSTALL_FAILURE_CODE.packageUnavailable) ? installFailureFrom(err) : undefined;
      if (need) setNeeds((current) => ({ ...current, [key]: need }));
      throw err;
    }
  }, []);

  return { needOf, track };
};

export { useInstallNeeds };
