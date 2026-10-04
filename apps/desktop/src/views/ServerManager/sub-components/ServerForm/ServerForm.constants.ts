/* @layer renderer-app @kind config */
import type { AuthKind } from '../../ServerManager.type';

const KEY_PLACEHOLDER = 'C:\\Users\\me\\.ssh\\id_ed25519';

const AUTH_OPTIONS: { value: AuthKind; label: string }[] = [
  { value: 'ssh-key', label: 'SSH key file' },
  { value: 'ssh-password', label: 'Password' },
];

const SSH_PORT_RANGE = { min: 1, max: 65535 };

export { AUTH_OPTIONS, KEY_PLACEHOLDER, SSH_PORT_RANGE };
