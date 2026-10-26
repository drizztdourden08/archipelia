/* @layer core @kind logic */
import { readRuntime } from '@archipelia/engine';
import type { PackagePreview } from './package-preview.type';
import { hashFile } from './hash-file';
import { previewPackages } from './preview-packages';
import { readApworld } from './read-apworld';

const previewFilePackages = async (engineDir: string, path: string, wheels?: string[]): Promise<PackagePreview> => {
  const info = await readApworld(path);
  return previewPackages(await readRuntime(engineDir), info.manifest.game ?? info.module, { info, sha256: await hashFile(path) }, wheels);
};

export { previewFilePackages };
