/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const STOP_ROOM_CONFIRM: ConfirmActionOptions = {
  title: 'Stop the room',
  message: 'The server stops and every player is disconnected.',
  confirmLabel: 'Stop',
  variant: 'danger',
};

export { STOP_ROOM_CONFIRM };
