/* @layer core @kind logic */
import { strFromU8, unzipSync } from 'fflate';
import { readFile } from 'node:fs/promises';
import type { ApworldInfo, ApworldManifest } from './read-apworld.type';
import { INIT, MANIFEST } from './read-apworld.constants';

const parseManifest = (bytes: Uint8Array | undefined): ApworldManifest => {
  if (!bytes) return {};
  try {
    const value: unknown = JSON.parse(strFromU8(bytes));
    return typeof value === 'object' && value !== null ? value : {};
  } catch {
    return {};
  }
};

const readApworld = async (file: string): Promise<ApworldInfo> => {
  const bytes = new Uint8Array(await readFile(file));
  const modules = new Set<string>();
  const found = unzipSync(bytes, {
    filter: ({ name }) => {
      const init = INIT.exec(name)?.[1];
      if (init) modules.add(init);
      return MANIFEST.test(name);
    },
  });
  const [module] = modules;
  if (modules.size !== 1 || module === undefined) throw new Error(`${file}: expected one world package, found ${modules.size}`);
  const manifestName = Object.keys(found).find((name) => name.startsWith(`${module}/`)) ?? Object.keys(found)[0];
  return { module, manifest: parseManifest(manifestName ? found[manifestName] : undefined), bytes };
};

export { readApworld };
