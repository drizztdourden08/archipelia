/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { SecretInputs } from '../ServerManager.type';
import { passphraseSecret, passwordSecret } from '@archipelia/model';

const withSecretRefs = (entry: ServerEntry, inputs: SecretInputs): ServerEntry => {
  const { auth, id } = entry;
  if (auth.kind === 'ssh-password') return { ...entry, auth: { ...auth, passwordRef: inputs.password ? passwordSecret(id) : auth.passwordRef } };
  return { ...entry, auth: { ...auth, passphraseRef: inputs.passphrase ? passphraseSecret(id) : auth.passphraseRef } };
};

export { withSecretRefs };
