/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { SecretInputs } from '../ServerManager.type';
import { sameServer } from './same-server';

const serverDirty = (draft: ServerEntry | null, saved: ServerEntry | undefined, inputs: SecretInputs): boolean => {
  if (!draft) return false;
  if (!saved) return true;
  return !sameServer(draft, saved) || inputs.password !== '' || inputs.passphrase !== '';
};

export { serverDirty };
