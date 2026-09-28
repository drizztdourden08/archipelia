/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { SecretInputs } from '../ServerManager.type';
import { passwordSecret } from './password-secret';
import { passphraseSecret } from './passphrase-secret';

const withSecretRefs = (entry: ServerEntry, inputs: SecretInputs): ServerEntry => {
  const { auth, id } = entry;
  if (auth.kind === 'ssh-password') return { ...entry, auth: { ...auth, passwordRef: inputs.password ? passwordSecret(id) : auth.passwordRef } };
  return { ...entry, auth: { ...auth, passphraseRef: inputs.passphrase ? passphraseSecret(id) : auth.passphraseRef } };
};

export { withSecretRefs };
