/* @layer client-kit @kind logic */
import type { ApworldBuildRecord, IndexBuildInput } from './index.type';
import { apworldNames } from './apworld-names';

const recordOf = (module: string, { archipelagoVersion, sha256, size }: IndexBuildInput): ApworldBuildRecord => {
  const { file, bundle } = apworldNames(module, archipelagoVersion);
  return { archipelagoVersion, file, sha256, size, bundle };
};

export { recordOf };
