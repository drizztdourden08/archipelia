/* @layer renderer-app @kind hook */
import { useNavigation } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEngineStore } from '../../../state/useEngineStore';
import { useLibraryStore } from '../../../state/useLibraryStore';
import { useRunsStore } from '../../../state/useRunsStore';
import { newestRuns } from './newest-runs';
import { RECENT_COUNT } from '../HomeView.constants';
import { needsEngineSetup } from './needs-engine-setup';

const useHome = () => {
  const { status, refresh } = useEngineStore();
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates } = useLibraryStore();
  const { runs, load, run } = useRunsStore();
  const { open } = useNavigation();
  const [now] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.allSettled([refresh(), loadInstalled(), loadPresets(), loadTemplates(), load()]);
  }, [refresh, loadInstalled, loadPresets, loadTemplates, load]);

  const recent = useMemo(() => newestRuns(runs, RECENT_COUNT), [runs]);
  const last = recent[0] ?? null;

  const openSession = useCallback((sessionId: string) => open('session', { sessionId }), [open]);
  const newSession = useCallback(() => open('sessions'), [open]);
  const openSettings = useCallback(() => open('settings'), [open]);

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

  const lastAction = useMemo(() => (last ? { label: 'Open', onClick: () => openSession(last.id) } : undefined), [last, openSession]);
  const engineAction = useMemo(
    () => (needsEngineSetup(status) ? { label: 'Open settings', onClick: openSettings, primary: true } : undefined),
    [status, openSettings],
  );
  const counts = useMemo(
    () => ({ games: installed.length, presets: presets.length, templates: templates.length }),
    [installed.length, presets.length, templates.length],
  );

  return {
    busy, counts, engineAction, error, installed, last, lastAction, newSession, now, openSession, presets, recent, runAgain, status,
  };
};

export { useHome };
