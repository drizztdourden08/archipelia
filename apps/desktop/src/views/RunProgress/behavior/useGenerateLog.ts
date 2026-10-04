/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { GenerateLogParams } from '../RunProgress.type';
import { readRunText } from '../../../storage/read-run-text';
import { GENERATE_LOG } from '../RunProgress.constants';

const useGenerateLog = ({ sessionId, startedAt, failed }: GenerateLogParams) => {
  const [logText, setLogText] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);

  const readLog = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLogText(await readRunText(sessionId, GENERATE_LOG));
    } catch {
      setLogText(null);
    }
  }, [sessionId]);

  useEffect(() => {
    setLogText(null);
    setShowLog(false);
  }, [startedAt]);

  useEffect(() => {
    if (failed) void readLog();
  }, [failed, readLog]);

  const toggleLog = useCallback(() => {
    setShowLog((shown) => !shown);
    void readLog();
  }, [readLog]);

  return { logText, showLog, toggleLog };
};

export { useGenerateLog };
