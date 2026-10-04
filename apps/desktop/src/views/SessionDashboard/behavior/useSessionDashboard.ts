/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmAction, useNow } from '@drizztdourden08/brock-react';
import { relaySessionView } from '../../../state/relay-session-view';
import { useRunsStore } from '../../../state/useRunsStore';
import { useSessionViewStore } from '../../../state/useSessionViewStore';
import { pickSession } from './pick-session';
import { COPIED_MS, NO_LINES, TICK_MS } from '../SessionDashboard.constants';
import { addressOf } from './address-of';
import { uptimeOf } from './uptime-of';

const useSessionDashboard = (sessionId: string) => {
  const { runs, loaded, logs, progress, load, loadLog, stop } = useRunsStore();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load(); }, [load]);

  const session = useMemo(() => pickSession(runs, sessionId), [runs, sessionId]);
  const id = session?.id ?? '';

  useEffect(() => { if (id) void loadLog(id); }, [id, loadLog]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const lines = (id ? logs[id] : undefined) ?? NO_LINES;

  useEffect(() => useSessionViewStore.getState().show({ session, lines, loaded }), [session, lines, loaded]);

  useEffect(relaySessionView, []);
  const now = useNow(TICK_MS, session?.status === 'hosting');
  const address = addressOf(session?.endpoint);

  const copyAddress = useCallback(() => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => setCopied(true), (err: Error) => setError(err.message));
  }, [address]);

  const stopSession = useCallback(() => {
    if (!id) return;
    void confirmAction({
      title: 'Stop the room',
      message: 'The server stops and every player is disconnected.',
      confirmLabel: 'Stop',
      variant: 'danger',
    }).then((confirmed) => {
      if (confirmed) stop(id).catch((err: Error) => setError(err.message));
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
