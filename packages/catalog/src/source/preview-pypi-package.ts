/* @layer core @kind logic */
import type { SourceRef } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import type { PackagePreview } from '../install/package-preview.type';
import { resolveWorldPackages } from '../install/resolve-world-packages';
import { linkedPypiName } from './linked-pypi-name';
import type { PlanDeps } from './source.type';

const previewPypiPackage = async (deps: PlanDeps, ref: SourceRef): Promise<PackagePreview> => {
  const name = await linkedPypiName(deps, ref);
  const runtime = await readRuntime(await deps.engineDir());
  return { sha256: '', packages: await resolveWorldPackages(runtime, name, [name]) };
};

export { previewPypiPackage };
