/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const FORGET_OWNER_CONFIRM: ConfirmActionOptions = {
  title: 'Forget the owner id',
  message: 'Rooms this app made on the site can no longer be controlled or read, by this app or anyone else. A new owner id is made the next time a session runs there.',
  confirmLabel: 'Forget',
  variant: 'danger',
  focus: 'cancel',
};

const NO_OWNER = 'No owner id yet. One is made the first time a session runs there.';

export { FORGET_OWNER_CONFIRM, NO_OWNER };
