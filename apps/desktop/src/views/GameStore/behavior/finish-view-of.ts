/* @layer renderer-app @kind logic */
import type { SourceFinish } from '@archipelia/design';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { FinishState, PackageSourceParams, SourceAim } from './usePackageSource.type';

const finishViewOf = (finish: FinishState, aim: SourceAim, { needOf, errorOf }: Pick<PackageSourceParams, 'needOf' | 'errorOf'>): SourceFinish => {
  if (finish.kind !== 'failed') return finish;
  if (finish.message) return { kind: 'failed', message: finish.message };
  const names = needOf(aim.key)?.packages.map((entry) => entry.name) ?? [];
  if (names.length > 0) return { kind: 'missing', names };
  return { kind: 'failed', message: errorOf(aim.key) ?? SOURCE_FAILURE.install };
};

export { finishViewOf };
