/* @layer electron-main @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { RemoteCredentials } from '@archipelia/hosts';
import { readFile } from 'node:fs/promises';
import type { SecretReader } from './server-credentials.type';

const secretOf = async (secrets: SecretReader, ref: string | undefined, what: string) => {
  if (!ref) return undefined;
  const value = await secrets.get(ref);
  if (value === null) throw new Error(`${what} is missing from the vault`);
  return value;
};

const credentialsOf = async ({ auth, label }: ServerEntry, secrets: SecretReader): Promise<RemoteCredentials> => {
  if (auth.kind === 'ssh-password') return { password: await secretOf(secrets, auth.passwordRef, `the password for ${label}`) };
  return {
    privateKey: await readFile(auth.keyPath),
    passphrase: await secretOf(secrets, auth.passphraseRef, `the key passphrase for ${label}`),
  };
};

export { credentialsOf };
