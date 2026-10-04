/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const STOP_ROOM_CONFIRM: ConfirmActionOptions = {
  title: 'Stop the room',
  message: 'The server stops and every player is disconnected.',
  confirmLabel: 'Stop',
  variant: 'danger',
};

const HOSTING_QUIT_MESSAGE = 'A room is hosting. Quitting stops its server and every player is disconnected.';

export { HOSTING_QUIT_MESSAGE, STOP_ROOM_CONFIRM };
