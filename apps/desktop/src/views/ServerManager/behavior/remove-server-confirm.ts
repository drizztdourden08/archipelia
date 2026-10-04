/* @layer renderer-app @kind logic */
import type { ConfirmDeleteOptions } from '@drizztdourden08/brock-react';
import type { ServerEntry } from '@archipelia/model';

const removeServerConfirm = (entry: ServerEntry): ConfirmDeleteOptions => ({
  what: entry.label,
  consequence: 'Its password and passphrase leave the vault. Sessions that host on it need another server.',
});

export { removeServerConfirm };
