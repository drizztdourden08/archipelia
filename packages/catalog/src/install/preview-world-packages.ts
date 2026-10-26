/* @layer core @kind logic */
import { readRuntime } from '@archipelia/engine';
import { chooseRelease } from '../first-party/choose-release';
import type { PreviewWorldParams } from './preview-world-packages.type';
import type { PackagePreview } from './package-preview.type';
import { downloadWorld } from './download-world';
import { hashFile } from './hash-file';
import { previewPackages } from './preview-packages';
import { readApworld } from './read-apworld';

const previewWorldPackages = async ({ engineDir, entry, version, fetch: request = fetch }: PreviewWorldParams): Promise<PackagePreview> => {
  if (entry.unavailable) throw new Error(`${entry.displayName}: ${entry.unavailable}`);
  const runtime = await readRuntime(engineDir);
  const { target } = chooseRelease(entry, version, runtime.apVersion);
  const download = await downloadWorld(target.url, request);
  try {
    return await previewPackages(runtime, entry.displayName, await readApworld(download.file), await hashFile(download.file));
  } finally {
    await download.dispose();
  }
};

export { previewWorldPackages };
