/* @layer renderer-app @kind logic */
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { CheckRun } from './usePackageSource.type';

const sourceCheck = async ({ aim, install, finishing }: CheckRun): Promise<void> => {
  const { request, key } = aim;
  if (request) await finishing(SOURCE_FAILURE.check, () => install(request, key));
};

export { sourceCheck };
