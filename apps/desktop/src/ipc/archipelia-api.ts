/* @layer renderer-app @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { ArchipeliaApi } from './contract.type';

const archipeliaApi = (): ArchipeliaApi => {
  const api = hostApi()?.archipelia;
  if (!api) throw new Error('window.api.archipelia is missing: the preload did not install it');
  return api;
};

export { archipeliaApi };
