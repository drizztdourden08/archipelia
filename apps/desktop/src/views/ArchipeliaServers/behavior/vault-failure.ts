/* @layer renderer-app @kind logic */
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';

const vaultOf = () => {
  const vault = secretsApi();
  if (!vault) throw new Error('the vault is not available');
  return vault;
};

export { vaultOf };
