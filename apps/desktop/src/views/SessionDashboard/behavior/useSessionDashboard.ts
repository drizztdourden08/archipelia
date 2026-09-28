/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRunsStore } from '../../../state/useRunsStore';
import { pickSession } from './pick-session';
import { COPIED_MS, NO_LINES, TICK_MS } from '../SessionDashboard.constants';
import { useNow } from './useNow';
import { addressOf } from './address-of';
import { confirmAction } from './confirm-action';
import { uptimeOf } from './uptime-of';

const useSessionDashboard = (sessionId: string) => {
  const { runs, logs, progress, load, loadLog, stop } = useRunsStore();
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load().finally(() => setLoaded(true)); }, [load]);

  const session = useMemo(() => pickSession(runs, sessionId), [runs, sessionId]);
  const id = session?.id ?? '';

  useEffect(() => { if (id) void loadLog(id); }, [id, loadLog]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const lines = (id ? logs[id] : undefined) ?? NO_LINES;
  const now = useNow(TICK_MS, session?.status === 'hosting');
  const address = addressOf(session?.endpoint);

  const copyAddress = useCallback(() => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => setCopied(true), (err: Error) => setError(err.message));
  }, [address]);

  const stopSession = useCallback(() => {
    if (!id) return;
    confirmAction({
      title: 'Stop the room',
      message: 'The server stops and every player is disconnected.',
      confirmLabel: 'Stop',
      run: () => { stop(id).catch((err: Error) => setError(err.message)); },
    });
  }, [id, stop]);

  return {
    address,
    copied,
    copyAddress,
    error,
    lines,
    loaded,
    progress: id ? progress[id] : undefined,
    session,
    stopSession,
    uptime: session ? uptimeOf(session, lines[0]?.at, now) : null,
  };
};

export { useSessionDashboard };
