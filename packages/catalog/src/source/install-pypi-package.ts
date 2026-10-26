/* @layer core @kind logic */
import type { SourceRef } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { assertPackagesAccepted } from '../install/assert-packages-accepted';
import { installWorldPackages } from '../install/install-world-packages';
import { previewPypiPackage } from './preview-pypi-package';
import type { PlanDeps } from './source.type';

const installPypiPackage = async (deps: PlanDeps, ref: SourceRef, accepted: string[]): Promise<void> => {
  const { packages } = await previewPypiPackage(deps, ref);
  const pins = packages.map((entry) => entry.pin);
  assertPackagesAccepted(ref.module, pins, '', { sha256: '', packages: accepted });
  await installWorldPackages(await readRuntime(await deps.engineDir()), ref.module, pins);
};

export { installPypiPackage };
