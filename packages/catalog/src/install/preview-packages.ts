/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { PackagePreview } from './package-preview.type';
import type { HashedWorld } from './preview-packages.type';
import { needsOf } from './needs-of';
import { resolveWorldPackages } from './resolve-world-packages';

const previewPackages = async (runtime: EngineRuntime, label: string, { info, sha256 }: HashedWorld, wheels?: string[]): Promise<PackagePreview> => {
  const needs = await needsOf(runtime, info, label, wheels);
  const sources = needs.wheels.map((wheel) => wheel.source);
  return { sha256, packages: await resolveWorldPackages(runtime, label, needs.declared), ...(sources.length > 0 ? { sources } : {}) };
};

export { previewPackages };
