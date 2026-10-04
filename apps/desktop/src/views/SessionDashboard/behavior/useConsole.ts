/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useRef, useState } from 'react';
import { confirmAction, useWidgetState } from '@drizztdourden08/brock-react';
import type { HostLogLine } from '@archipelia/hosts';
import { useRunsStore } from '../../../stores/useRunsStore';
import { MAX_SENT } from '../SessionDashboard.constants';
import type { SentCommand } from '../SessionDashboard.type';
import { consoleRows } from './console-rows';

const useConsole = (sessionId: string, lines: readonly HostLogLine[]) => {
  const command = useRunsStore((s) => s.command);
  const [draft, setDraft] = useWidgetState('draft', '');
  const [sent, setSent] = useState<SentCommand[]>([]);
  const nextId = useRef(0);

  const send = useCallback(async (text: string) => {
    const cmd = text.trim();
    if (!cmd) return;
    nextId.current += 1;
    const entry: SentCommand = { id: nextId.current, text: cmd, at: Date.now(), error: null };
    setSent((prev) => [...prev, entry].slice(-MAX_SENT));
    try {
      await command(sessionId, cmd);
    } catch (err) {
      const error = (err as Error).message;
      setSent((prev) => prev.map((item) => (item.id === entry.id ? { ...item, error } : item)));
    }
  }, [command, sessionId]);

  const submit = useCallback((text: string) => { void send(text); }, [send]);

  const confirmSend = useCallback((cmd: string, title: string, message: string) => {
    void confirmAction({ title, message, confirmLabel: 'Send', variant: 'danger' }).then((confirmed) => {
      if (confirmed) void send(cmd);
    });
  }, [send]);

  const history = useMemo(() => sent.map((item) => item.text), [sent]);
  const rows = useMemo(() => consoleRows(sent, lines), [sent, lines]);

  return { confirmSend, draft, history, rows, send, setDraft, submit };
};

export { useConsole };
