/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { ServerEntry } from '@archipelia/model';

const removeServerConfirm = (entry: ServerEntry): ConfirmActionOptions => ({
  title: 'Remove server',
  message: `Remove ${entry.label}? Its password and passphrase leave the vault. Sessions that host on it need another server.`,
  confirmLabel: 'Remove',
  variant: 'danger',
});

export { removeServerConfirm };
