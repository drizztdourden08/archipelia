/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmAction, useCopyText, useJob, useNow } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../../../stores/useRunsStore';
import { useSessionViewStore } from '../../../stores/useSessionViewStore';
import { pickSession } from './pick-session';
import { runJobId } from '../../../jobs/run-job-id';
import { NO_LINES, TICK_MS } from '../SessionDashboard.constants';
import { addressOf } from './address-of';
import { uptimeOf } from './uptime-of';
import { STOP_ROOM_CONFIRM } from '../../../rooms/stop-room-confirm.constants';

const useSessionDashboard = (sessionId: string) => {
  const { runs, loaded, logs, load, loadLog, stop } = useRunsStore();
  const { copied, copy, error: copyError } = useCopyText();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load(); }, [load]);

  const session = useMemo(() => pickSession(runs, sessionId), [runs, sessionId]);
  const id = session?.id ?? '';

  useEffect(() => { if (id) void loadLog(id); }, [id, loadLog]);

  const lines = (id ? logs[id] : undefined) ?? NO_LINES;
  const { job } = useJob(runJobId(id));

  useEffect(() => useSessionViewStore.getState().show({ session, lines, loaded }), [session, lines, loaded]);

  const now = useNow(TICK_MS, session?.status === 'hosting');
  const address = addressOf(session?.endpoint);

  const copyAddress = useCallback(() => {
    if (address) void copy(address);
  }, [address, copy]);

  const stopSession = useCallback(() => {
    if (!id) return;
    void confirmAction(STOP_ROOM_CONFIRM).then((confirmed) => {
      if (confirmed) stop(id).catch((err: Error) => setError(err.message));
    });
  }, [id, stop]);

  return {
    address,
    copied,
    copyAddress,
    error: error ?? copyError,
    lines,
    loaded,
    progress: job,
    session,
    stopSession,
    uptime: session ? uptimeOf(session, lines[0]?.at, now) : null,
  };
};

export { useSessionDashboard };
