/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { useDataAction } from '../../../hooks/useDataAction';
import { useRunsStore } from '../../../stores/useRunsStore';
import { CLEAN_DAYS } from '../OldRuns.constants';
import { cleanRunsConfirm } from './clean-runs-confirm';
import { olderThan } from './old-runs';

const useOldRuns = () => {
  const { runs, load, remove } = useRunsStore();
  const { busy, message, run } = useDataAction();

  useEffect(() => { void load(); }, [load]);

  const stale = olderThan(runs, CLEAN_DAYS, Date.now());
  const clean = useCallback(() => {
    void confirmAction(cleanRunsConfirm(stale.length)).then((confirmed) => {
      if (!confirmed) return;
      void run('clean', async () => {
        for (const old of stale) await remove(old.id);
        return `${stale.length} old runs removed`;
      });
    });
  }, [remove, run, stale]);

  return { busy, clean, kept: runs.length, message, stale: stale.length };
};

export { useOldRuns };
