/* @layer renderer-app @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { AppApi } from './contract.type';

const appApi = (): AppApi => {
  const api = hostApi();
  if (!api) throw new Error('window.api is missing: the preload did not run');
  return api as AppApi;
};

export { appApi };
