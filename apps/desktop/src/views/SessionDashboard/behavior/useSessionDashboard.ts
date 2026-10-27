/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { confirmAction, useCopyText, useJob, useNow } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../../../stores/useRunsStore';
import { runJobId } from '@archipelia/model';
import { FAILURE, NO_LINES, TICK_MS } from '../SessionDashboard.constants';
import { failWith } from '../../../hooks/fail-with';
import { useLoggedFailure } from '../../../hooks/useLoggedFailure';
import { addressOf } from './address-of';
import { uptimeOf } from './uptime-of';
import { STOP_ROOM_CONFIRM } from '../../../rooms/stop-room-confirm.constants';

const useSessionDashboard = (sessionId: string) => {
  const { runs, logs, stop } = useRunsStore();
  const { copied, copy, error: copyError } = useCopyText();
  const [error, setError] = useState<string | null>(null);

  const session = useMemo(() => runs.find((run) => run.id === sessionId) ?? null, [runs, sessionId]);
  const id = session?.id ?? '';

  const lines = (id ? logs[id] : undefined) ?? NO_LINES;
  const { job } = useJob(runJobId(id));

  const copyFailure = useLoggedFailure(copyError, FAILURE.copy);

  const now = useNow(TICK_MS, session?.status === 'hosting');
  const address = addressOf(session?.endpoint);

  const copyAddress = useCallback(() => {
    if (address) void copy(address);
  }, [address, copy]);

  const stopSession = useCallback(() => {
    if (!id) return;
    void confirmAction(STOP_ROOM_CONFIRM).then((confirmed) => {
      if (confirmed) failWith(FAILURE.stop, () => stop(id))().catch((err: Error) => setError(err.message));
    });
  }, [id, stop]);

  return {
    address,
    copied,
    copyAddress,
    error: error ?? copyFailure,
    lines,
    progress: job,
    session,
    stopSession,
    uptime: session ? uptimeOf(session, lines[0]?.at, now) : null,
  };
};

export { useSessionDashboard };
