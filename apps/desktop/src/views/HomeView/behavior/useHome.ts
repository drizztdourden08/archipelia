/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { useEngineStore } from '../../../stores/useEngineStore';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { newestRuns } from './newest-runs';
import { RECENT_COUNT } from '../HomeView.constants';
import { needsEngineSetup } from './needs-engine-setup';
import { openNewSession } from '../../../hooks/open-new-session';

const useHome = () => {
  const { status, refresh } = useEngineStore();
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates } = useLibraryStore();
  const { runs, load, run } = useRunsStore();
  const { open, openSession } = useAppNavigation();
  const [now] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.allSettled([refresh(), loadInstalled(), loadPresets(), loadTemplates(), load()]);
  }, [refresh, loadInstalled, loadPresets, loadTemplates, load]);

  const recent = useMemo(() => newestRuns(runs, RECENT_COUNT), [runs]);
  const last = recent[0] ?? null;

  const openEngine = useCallback(() => open(ROUTE.engine), [open]);

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

  const engineNeeded = needsEngineSetup(status);
  const counts = useMemo(
    () => ({ games: installed.length, presets: presets.length, sessions: templates.length }),
    [installed.length, presets.length, templates.length],
  );

  return {
    busy, counts, engineNeeded, error, installed, last, newSession: openNewSession, now, openEngine, openSession, presets, recent, runAgain, status,
  };
};

export { useHome };
