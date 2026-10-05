/* @layer renderer-app @kind logic */
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { appApi } from '../../../ipc/app-api';
import { passwordSecret } from './password-secret';
import { passphraseSecret } from './passphrase-secret';

const removeServer = async (id: string): Promise<void> => {
  await appApi().serversRemove(id);
  const vault = secretsApi();
  if (vault) await Promise.all([passwordSecret(id), passphraseSecret(id)].map((name) => vault.delete(name)));
};

export { removeServer };
