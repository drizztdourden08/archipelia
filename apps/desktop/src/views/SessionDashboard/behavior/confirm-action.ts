/* @layer renderer-app @kind logic */
import { dialogs, useDialogStore } from '@drizztdourden08/brock-react';
import type { ConfirmActionParams } from '../SessionDashboard.type';

const confirmAction = ({ title, message, confirmLabel, run }: ConfirmActionParams) => dialogs.show({
  title,
  message,
  confirmLabel,
  variant: 'danger',
  onConfirm: () => {
    useDialogStore.setState({ dialog: null });
    run();
  },
});

export { confirmAction };
