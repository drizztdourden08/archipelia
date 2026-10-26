/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { PackagePreview } from './package-preview.type';
import type { ApworldInfo } from './read-apworld.type';
import { resolveWorldPackages } from './resolve-world-packages';
import { worldPackages } from './world-packages';

const previewPackages = async (runtime: EngineRuntime, label: string, info: ApworldInfo, sha256: string): Promise<PackagePreview> => ({
  sha256, packages: await resolveWorldPackages(runtime, label, worldPackages(info, label)),
});

export { previewPackages };
