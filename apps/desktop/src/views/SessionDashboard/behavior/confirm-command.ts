/* @layer renderer-app @kind logic */
import { confirmAction } from '@drizztdourden08/brock-react';

const confirmCommand = (title: string, message: string, send: () => void): void => {
  void confirmAction({ title, message, confirmLabel: 'Send', variant: 'danger' }).then((confirmed) => {
    if (confirmed) send();
  });
};

export { confirmCommand };
