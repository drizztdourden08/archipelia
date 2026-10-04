/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { GG_OWNER_SECRET } from '@archipelia/hosts/archipelago-gg';
import { NO_OWNER } from './gg-owner.constants';
import { hasGgOwner } from './has-gg-owner';

const forgetGgOwner = async (): Promise<void> => {
  if (!(await hasGgOwner())) throw new Error(NO_OWNER);
  await secretsApi()?.delete(GG_OWNER_SECRET);
  toast('The owner id is forgotten', { variant: 'success' });
};

export { forgetGgOwner };
