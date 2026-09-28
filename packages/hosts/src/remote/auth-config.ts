/* @layer core @kind logic */
import type { ServerAuth } from '@archipelia/model';
import type { ConnectConfig } from 'ssh2';
import type { RemoteCredentials } from './remote.type';

const authConfig = (auth: ServerAuth, { privateKey, passphrase, password }: RemoteCredentials): ConnectConfig => {
  if (auth.kind === 'ssh-key') {
    if (!privateKey) throw new Error('this server needs its private key');
    return { username: auth.username, privateKey, passphrase };
  }
  if (!password) throw new Error('this server needs its password');
  return { username: auth.username, password };
};

export { authConfig };
