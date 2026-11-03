/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { confirmCommandOf } from './confirm-command-of';

const useCommandSubmit = (send: (line: string) => Promise<void>, clear: () => void) =>
  useCallback((line: string): boolean => {
    const command = confirmCommandOf(line);
    if (command === undefined) {
      void send(line);
      return true;
    }
    const message = `${command.description} Command: ${line.trim()}`;
    void confirmAction({ title: command.label, message, confirmLabel: 'Send', variant: 'danger' }).then((confirmed) => {
      if (!confirmed) return;
      void send(line);
      clear();
    });
    return false;
  }, [send, clear]);

export { useCommandSubmit };
