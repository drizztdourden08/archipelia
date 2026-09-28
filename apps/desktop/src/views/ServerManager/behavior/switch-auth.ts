/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { AuthKind } from '../ServerManager.type';

const switchAuth = (entry: ServerEntry, kind: AuthKind): ServerEntry => {
  const { username } = entry.auth;
  if (kind === 'ssh-password') return { ...entry, auth: { kind, username, passwordRef: '' } };
  return { ...entry, auth: { kind, username, keyPath: '' } };
};

export { switchAuth };
