/* @layer electron-main @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { passphraseSecret, passwordSecret } from '@archipelia/model';

const canonicalServerRefs = (entry: ServerEntry): ServerEntry => {
  const id = entry.id || newId();
  const { auth } = entry;
  if (auth.kind === 'ssh-password') return { ...entry, id, auth: { ...auth, passwordRef: auth.passwordRef ? passwordSecret(id) : '' } };
  const { passphraseRef: _ignored, ...rest } = auth;
  return { ...entry, id, auth: auth.passphraseRef ? { ...rest, passphraseRef: passphraseSecret(id) } : rest };
};

export { canonicalServerRefs };
