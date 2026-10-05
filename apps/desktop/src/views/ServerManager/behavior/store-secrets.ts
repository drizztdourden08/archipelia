/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import type { SecretInputs } from '../ServerManager.type';
import { passwordSecret } from './password-secret';
import { passphraseSecret } from './passphrase-secret';

const storeSecrets = async (entry: ServerEntry, inputs: SecretInputs): Promise<void> => {
  const secrets = secretsApi();
  if (!secrets) throw new Error('the vault is not available');
  if (inputs.password) await secrets.set(passwordSecret(entry.id), inputs.password, `SSH password for ${entry.label}`);
  if (inputs.passphrase) await secrets.set(passphraseSecret(entry.id), inputs.passphrase, `Key passphrase for ${entry.label}`);
};

export { storeSecrets };
