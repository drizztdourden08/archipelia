/* @layer core @kind logic */
import { readApworld } from './read-apworld';
import { worldPackages } from './world-packages';

const previewFilePackages = async (path: string): Promise<string[]> => {
  const info = await readApworld(path);
  return worldPackages(info, info.manifest.game ?? info.module);
};

export { previewFilePackages };
