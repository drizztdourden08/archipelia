/* @layer renderer-app @kind config */
import type { AuthKind } from '../../ServerManager.type';

const KEY_PLACEHOLDER = 'C:\\Users\\me\\.ssh\\id_ed25519';

const AUTH_OPTIONS: { value: AuthKind; label: string }[] = [
  { value: 'ssh-key', label: 'SSH key file' },
  { value: 'ssh-password', label: 'Password' },
];

export { AUTH_OPTIONS, KEY_PLACEHOLDER };
