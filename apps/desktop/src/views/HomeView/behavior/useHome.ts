/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { openNewSession } from '../../../hooks/open-new-session';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { useEngineStore } from '../../../stores/useEngineStore';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { newestRuns } from './newest-runs';
import { RECENT_COUNT } from '../HomeView.constants';
import { needsEngineSetup } from './needs-engine-setup';
import { homeSteps } from './home-steps';
import { useRunAgain } from './useRunAgain';

const useHome = () => {
  const { status, refresh } = useEngineStore();
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates } = useLibraryStore();
  const { runs, loaded, load } = useRunsStore();
  const { open, openSession } = useAppNavigation();
  const [now] = useState(() => Date.now());

  useEffect(() => {
    void Promise.allSettled([refresh(), loadInstalled(), loadPresets(), loadTemplates(), load()]);
  }, [refresh, loadInstalled, loadPresets, loadTemplates, load]);

  const recent = useMemo(() => newestRuns(runs, RECENT_COUNT), [runs]);
  const last = recent[0] ?? null;
  const again = useRunAgain(last, openSession);

  const act = useCallback((id: string) => {
    if (id === 'again') void again.runAgain();
    else if (id === 'session') openNewSession();
    else if (id === 'engine') open(ROUTE.engine);
    else if (id === 'games') open(ROUTE.games);
    else if (id === 'preset') open(ROUTE.presets);
    else open(ROUTE.sessions);
  }, [again, open]);

  const steps = useMemo(
    () => homeSteps({ status, installed, presets, sessions: templates.length }),
    [status, installed, presets, templates.length],
  );
  const counts = useMemo(
    () => ({ games: installed.length, presets: presets.length, sessions: templates.length }),
    [installed.length, presets.length, templates.length],
  );

  return {
    act, busy: again.busy, counts, engineNeeded: needsEngineSetup(status), error: again.error, firstRun: loaded && runs.length === 0,
    installed, last, next: steps.find((step) => !step.done) ?? null, now, openSession, presets, recent, status, steps,
  };
};

export { useHome };
