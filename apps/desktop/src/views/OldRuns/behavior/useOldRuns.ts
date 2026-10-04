/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import { confirmDelete } from '@drizztdourden08/brock-react';
import { useDataAction } from '../../../hooks/useDataAction';
import { useRunsStore } from '../../../stores/useRunsStore';
import { reloadRuns } from '../../../runs/reload-runs';
import { CLEAN_DAYS, CLEAN_FAILED } from '../OldRuns.constants';
import { cleanRunsConfirm } from './clean-runs-confirm';
import { olderThan } from './old-runs';

const useOldRuns = () => {
  const { runs, remove } = useRunsStore();
  const { busy, error, message, run } = useDataAction();

  useEffect(reloadRuns, []);

  const stale = olderThan(runs, CLEAN_DAYS, Date.now());
  const clean = useCallback(() => {
    void confirmDelete(cleanRunsConfirm(stale.length)).then((confirmed) => {
      if (!confirmed) return;
      void run('clean', CLEAN_FAILED, async () => {
        for (const old of stale) await remove(old.id);
        return `${stale.length} old runs removed`;
      });
    });
  }, [remove, run, stale]);

  return { busy, clean, error, kept: runs.length, message, stale: stale.length };
};

export { useOldRuns };
