/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const CLOSE_JOINED: ConfirmActionOptions = {
  title: 'Close the lobby?',
  message: 'Players who joined leave. The setup and your own players stay saved.',
  confirmLabel: 'Close lobby',
  variant: 'danger',
};

const CLOSE_HOSTING: ConfirmActionOptions = {
  title: 'Stop the room and close',
  message: 'The server stops, every player is disconnected and the tab closes.',
  confirmLabel: 'Stop the room and close',
  variant: 'danger',
};

const CLOSE_GENERATING: ConfirmActionOptions = {
  title: 'Cancel the run and close?',
  message: 'The seed is still being made. Cancelling stops it and the tab closes.',
  confirmLabel: 'Cancel the run and close',
  variant: 'danger',
};

const CLOSE_FAILED = 'Could not close the tab.';

export { CLOSE_FAILED, CLOSE_GENERATING, CLOSE_HOSTING, CLOSE_JOINED };
