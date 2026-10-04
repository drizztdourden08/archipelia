/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { SessionText } from '../SessionDashboard.type';
import { IDLE, READ_FAILED } from '../SessionDashboard.constants';
import { readRunText } from '../../../storage/read-run-text';
import { logFailure } from '../../../hooks/log-failure';

const useSessionText = (sessionId: string, file: string | null) => {
  const [text, setText] = useState<SessionText>(IDLE);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!file) {
      setText(IDLE);
      return undefined;
    }
    let alive = true;
    setText({ value: null, loading: true, failed: false });
    readRunText(sessionId, file)
      .then((value) => { if (alive) setText({ value, loading: false, failed: false }); })
      .catch((err: unknown) => {
        logFailure(READ_FAILED, err);
        if (alive) setText({ value: null, loading: false, failed: true });
      });
    return () => { alive = false; };
  }, [sessionId, file, attempt]);
  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  return { ...text, retry };
};

export { useSessionText };
