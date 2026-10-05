/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';

const fieldsOf = ({ label, host, port, gamePort, apPath, auth }: ServerEntry): string => {
  const secret = auth.kind === 'ssh-key' ? [auth.keyPath, auth.passphraseRef] : [auth.passwordRef];
  return JSON.stringify([label, host, port, gamePort, apPath, auth.kind, auth.username, ...secret]);
};

const sameServer = (a: ServerEntry, b: ServerEntry): boolean => fieldsOf(a) === fieldsOf(b);

export { sameServer };
