/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { SessionText } from '../SessionDashboard.type';
import { IDLE } from '../SessionDashboard.constants';
import { archipeliaApi } from '../../../ipc/archipelia-api';

const useSessionText = (sessionId: string, file: string | null): SessionText => {
  const [text, setText] = useState<SessionText>(IDLE);
  useEffect(() => {
    if (!file) {
      setText(IDLE);
      return undefined;
    }
    let alive = true;
    setText({ value: null, loading: true });
    archipeliaApi().sessionsReadText(sessionId, file)
      .then((value) => { if (alive) setText({ value, loading: false }); })
      .catch(() => { if (alive) setText(IDLE); });
    return () => { alive = false; };
  }, [sessionId, file]);
  return text;
};

export { useSessionText };
