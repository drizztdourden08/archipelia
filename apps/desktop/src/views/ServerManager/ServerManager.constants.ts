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

export { DEFAULT_GAME_PORT, DRAFT_RULES, EMPTY_INPUTS, NO_SERVER_TEXT };
