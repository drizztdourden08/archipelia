/* @layer renderer-app @kind config */
import type { DraftRule, SecretInputs } from './ServerManager.type';
import { validPort } from './behavior/valid-port';

const DRAFT_RULES: DraftRule[] = [
  { message: 'Give the server a label.', broken: (entry) => !entry.label.trim() },
  { message: 'Enter the host name or address.', broken: (entry) => !entry.host.trim() },
  { message: 'Enter the user name.', broken: (entry) => !entry.auth.username.trim() },
  { message: 'Ports must be between 1 and 65535.', broken: (entry) => !(validPort(entry.port) && validPort(entry.gamePort)) },
  { message: 'The Archipelago path must be absolute.', broken: (entry) => !entry.apPath.startsWith('/') },
  { message: 'Enter the path of the key file.', broken: ({ auth }) => auth.kind === 'ssh-key' && !auth.keyPath.trim() },
  { message: 'Enter the password.', broken: ({ auth }, inputs) => auth.kind === 'ssh-password' && !auth.passwordRef && !inputs.password },
];

const DEFAULT_GAME_PORT = 38281;

const EMPTY_INPUTS: SecretInputs = { password: '', passphrase: '' };

const FAILURE = {
  save: 'Could not save the server.',
  test: 'Could not test the connection.',
  trust: 'Could not trust the host key.',
  remove: 'Could not remove the server.',
} as const;

export { DEFAULT_GAME_PORT, DRAFT_RULES, EMPTY_INPUTS, FAILURE };
