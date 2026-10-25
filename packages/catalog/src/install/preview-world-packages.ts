/* @layer core @kind logic */
import { readRuntime } from '@archipelia/engine';
import { chooseRelease } from '../first-party/choose-release';
import type { PreviewWorldParams } from './preview-world-packages.type';
import { downloadWorld } from './download-world';
import { readApworld } from './read-apworld';
import { worldPackages } from './world-packages';

const previewWorldPackages = async ({ engineDir, entry, version, fetch: request = fetch }: PreviewWorldParams): Promise<string[]> => {
  if (entry.unavailable) throw new Error(`${entry.displayName}: ${entry.unavailable}`);
  const runtime = await readRuntime(engineDir);
  const { target } = chooseRelease(entry, version, runtime.apVersion);
  const download = await downloadWorld(target.url, request);
  try {
    return worldPackages(await readApworld(download.file), entry.displayName);
  } finally {
    await download.dispose();
  }
};

export { previewWorldPackages };
