/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmDelete, toast } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { failWith } from '../../../hooks/fail-with';
import { openSessionEditor } from '../../../hooks/open-session-editor';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { isWorking } from '../../../runs/is-working';
import { showRunJob } from '../../../runs/show-run-job';
import { useRunsStore } from '../../../stores/useRunsStore';
import { CLEAN_DAYS, FAILURE } from '../History.constants';
import { cleanRunsConfirm } from './clean-runs-confirm';
import { olderThan } from './old-runs';
import type { HistoryActionsInput } from './history-actions.type';

const useHistoryActions = ({ runs, guard }: HistoryActionsInput) => {
  const removeRun = useRunsStore((state) => state.remove);
  const { openSession } = useAppNavigation();

  const showLog = useCallback((run: Session) => { void showRunJob(run); }, []);

  const openRun = useCallback((run: Session) => {
    if (isWorking(run)) void showRunJob(run);
    else openSession(run.id);
  }, [openSession]);

  const deleteRun = useCallback((run: Session) => {
    const what = `this run of ${run.snapshot.name}`;
    void confirmDelete({ what, consequence: 'Its output files go with it.' }).then((confirmed) => {
      if (confirmed) void guard(run.id, failWith(FAILURE.deleteRun, () => removeRun(run.id)));
    });
  }, [guard, removeRun]);

  const stale = olderThan(runs, CLEAN_DAYS, Date.now());
  const clean = useCallback(() => {
    void confirmDelete(cleanRunsConfirm(stale.length)).then((confirmed) => {
      if (!confirmed) return;
      void guard('clean', failWith(FAILURE.clean, async () => {
        for (const old of stale) await removeRun(old.id);
        toast(`${stale.length} old ${stale.length === 1 ? 'run' : 'runs'} removed`);
      }));
    });
  }, [guard, removeRun, stale]);

  return { clean, deleteRun, openRun, openSessionOf: openSessionEditor, showLog, staleCount: stale.length };
};

export { useHistoryActions };
