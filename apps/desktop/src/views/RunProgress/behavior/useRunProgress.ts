/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo } from 'react';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { useRunsStore } from '../../../state/useRunsStore';
import { generateTextOf } from './generate-text-of';
import { hostLinesOf } from './host-lines-of';
import { runLogRows } from './run-log-rows';
import { findLaunchedRun } from './find-launched-run';
import type { RunLaunch } from '../RunProgress.type';
import { runView } from './run-view';
import { useGenerateLog } from './useGenerateLog';

const useRunProgress = (launch: RunLaunch | null, onClose: () => void) => {
  const runs = useRunsStore((state) => state.runs);
  const progressMap = useRunsStore((state) => state.progress);
  const hostLogs = useRunsStore((state) => state.logs);
  const streamed = useRunsStore((state) => state.generateLines);
  const cancelRun = useRunsStore((state) => state.cancel);
  const { openSession } = useAppNavigation();

  const session = useMemo(() => (launch ? findLaunchedRun(runs, launch) : undefined), [runs, launch]);
  const sessionId = session?.id;
  const status = session?.status;
  const progress = sessionId ? progressMap[sessionId] : undefined;
  const failed = status === 'failed' || Boolean(launch?.error);
  const { logText, showLog, toggleLog } = useGenerateLog({ sessionId, startedAt: launch?.startedAt, failed });

  useEffect(() => {
    if (!launch || launch.inspect || !sessionId || status !== 'hosting') return;
    onClose();
    openSession(sessionId);
  }, [launch, onClose, openSession, sessionId, status]);

  const generateText = generateTextOf(logText, streamed, sessionId);
  const logRows = useMemo(
    () => runLogRows({ generateText, hostLines: hostLinesOf(hostLogs, sessionId, status), showLog }),
    [hostLogs, generateText, sessionId, showLog, status],
  );

  const cancel = useCallback(() => { if (sessionId) void cancelRun(sessionId); }, [cancelRun, sessionId]);

  return {
    ...runView({ session, launch, progress, failed }),
    cancel,
    failed,
    logRows,
    logVisible: showLog || failed,
    toggleLog,
    showLog,
  };
};

export { useRunProgress };
