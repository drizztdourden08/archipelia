/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useRunsStore } from '../../../state/useRunsStore';
import { MAX_SENT } from '../SessionDashboard.constants';
import { confirmAction } from './confirm-action';

const useConsole = (sessionId: string) => {
  const command = useRunsStore((s) => s.command);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (text: string) => {
    const cmd = text.trim();
    if (!cmd) return;
    setError(null);
    try {
      await command(sessionId, cmd);
      setSent((prev) => [...prev, cmd].slice(-MAX_SENT));
    } catch (err) {
      setError((err as Error).message);
    }
  }, [command, sessionId]);

  const submit = useCallback(() => {
    void send(draft);
    setDraft('');
  }, [draft, send]);

  const confirmSend = useCallback((cmd: string, title: string, message: string) => {
    confirmAction({ title, message, confirmLabel: 'Send', run: () => { void send(cmd); } });
  }, [send]);

  return { confirmSend, draft, error, send, sent, setDraft, submit };
};

export { useConsole };
