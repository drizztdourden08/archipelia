/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { Session } from '@archipelia/model';
import { openSessionLobby } from '../../../hooks/open-session-lobby';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { savedSessionOf } from '../../../runs/saved-session-of';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { RUN_AGAIN_GONE } from '../HomeView.constants';

const useRunAgain = (last: Session | null) => {
  const templates = useLibraryStore((state) => state.templates);
  const saveTemplate = useLibraryStore((state) => state.saveTemplate);
  const startSession = useSessionStart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgain = useCallback(async () => {
    if (!last) return;
    setBusy(true);
    setError(null);
    try {
      const saved = savedSessionOf(templates, last);
      if (!saved) throw new Error(RUN_AGAIN_GONE);
      const started = await startSession({ ...saved, players: last.snapshot.players }, saveTemplate);
      if (started) openSessionLobby(started.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [last, saveTemplate, startSession, templates]);

  return useMemo(() => ({ busy, error, runAgain }), [busy, error, runAgain]);
};

export { useRunAgain };
