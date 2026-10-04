/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { confirmAction, useWidgetState } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../../../stores/useRunsStore';
import { MAX_SENT } from '../SessionDashboard.constants';

const useConsole = (sessionId: string) => {
  const command = useRunsStore((s) => s.command);
  const [draft, setDraft] = useWidgetState('draft', '');
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
  }, [draft, send, setDraft]);

  const confirmSend = useCallback((cmd: string, title: string, message: string) => {
    void confirmAction({ title, message, confirmLabel: 'Send', variant: 'danger' }).then((confirmed) => {
      if (confirmed) void send(cmd);
    });
  }, [send]);

  return { confirmSend, draft, error, send, sent, setDraft, submit };
};

export { useConsole };
