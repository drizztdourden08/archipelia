/* @layer renderer-app @kind logic */
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { GG_OWNER_SECRET } from '@archipelia/hosts/archipelago-gg';

const hasGgOwner = async (): Promise<boolean> => (await secretsApi()?.has(GG_OWNER_SECRET)) ?? false;

export { hasGgOwner };
