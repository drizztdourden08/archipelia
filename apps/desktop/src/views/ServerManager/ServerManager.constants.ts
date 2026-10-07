/* @layer renderer-app @kind config */
import { inPortRange, PORT_PROBLEM } from '@archipelia/design';
import type { DraftRule, SecretInputs } from './ServerManager.type';
import { validPort } from './behavior/valid-port';

const DRAFT_RULES: DraftRule[] = [
  { field: 'label', message: 'Give the server a label.', broken: (entry) => !entry.label.trim() },
  { field: 'host', message: 'Enter the host name or address.', broken: (entry) => !entry.host.trim() },
  { field: 'port', message: 'The SSH port must be between 1 and 65535.', broken: (entry) => !validPort(entry.port) },
  { field: 'username', message: 'Enter the user name.', broken: (entry) => !entry.auth.username.trim() },
  { field: 'keyPath', message: 'Enter the path of the key file.', broken: ({ auth }) => auth.kind === 'ssh-key' && !auth.keyPath.trim() },
  { field: 'password', message: 'Enter the password.', broken: ({ auth }, inputs) => auth.kind === 'ssh-password' && !auth.passwordRef && !inputs.password },
  { field: 'apPath', message: 'The Archipelago path must be absolute.', broken: (entry) => !entry.apPath.startsWith('/') },
  { field: 'gamePort', message: PORT_PROBLEM, broken: (entry) => !inPortRange(entry.gamePort) },
];

const DEFAULT_GAME_PORT = 38281;

const EMPTY_INPUTS: SecretInputs = { password: '', passphrase: '' };

const NO_SERVER_TEXT = 'Add a remote machine you reach over SSH. Hosting on this computer needs no server.';

const VAULT_NOTE = 'Passwords and key passphrases stay encrypted in the vault and are only used by the app itself.';

const LIST = {
  title: 'Servers',
  add: 'Add server',
  nameLabel: 'Server label',
  submit: 'Add',
  width: 'servers.list-width',
  empty: 'No server yet.',
} as const;

const NEW_SERVER = { id: 'new-server', label: 'New server', meta: 'Not saved yet' } as const;

const finishFirst = (label: string) => `Save or discard the changes to ${label} first.`;

const FAILURE = {
  save: 'Could not save the server.',
  test: 'Could not test the connection.',
  trust: 'Could not trust the host key.',
  remove: 'Could not remove the server.',
  rename: 'Could not rename the server.',
} as const;

const OTHER_FAILURES = ['test', 'trust', 'remove', 'rename'] as const;

export { DEFAULT_GAME_PORT, DRAFT_RULES, EMPTY_INPUTS, FAILURE, finishFirst, LIST, NEW_SERVER, NO_SERVER_TEXT, OTHER_FAILURES, VAULT_NOTE };
