/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { readFile } from 'node:fs/promises';
import { APWORLD_LIMITS, unzipCapped } from '@archipelia/model/zip';
import type { ApworldInfo, ApworldManifest } from './read-apworld.type';
import { INIT, MANIFEST, MAX_MANIFEST_BYTES, MAX_REQUIREMENTS_BYTES, REQUIREMENTS } from './read-apworld.constants';

const parseManifest = (bytes: Uint8Array | undefined): ApworldManifest => {
  if (!bytes) return {};
  try {
    const value: unknown = JSON.parse(strFromU8(bytes));
    return typeof value === 'object' && value !== null ? value : {};
  } catch {
    return {};
  }
};

const wanted = ({ name, size }: { name: string; size: number }) =>
  (MANIFEST.test(name) && size <= MAX_MANIFEST_BYTES) || (REQUIREMENTS.test(name) && size <= MAX_REQUIREMENTS_BYTES);

const readApworld = async (file: string): Promise<ApworldInfo> => {
  const bytes = new Uint8Array(await readFile(file));
  const modules = new Set<string>();
  const { files: found } = unzipCapped(bytes, APWORLD_LIMITS, (entry) => {
    const init = INIT.exec(entry.name)?.[1];
    if (init) modules.add(init);
    return wanted(entry);
  });
  const [module] = modules;
  if (modules.size !== 1 || module === undefined) throw new Error(`${file}: expected one world package, found ${modules.size}`);
  const manifests = Object.keys(found).filter((name) => MANIFEST.test(name));
  const manifestName = manifests.find((name) => name.startsWith(`${module}/`)) ?? manifests[0];
  const requirements = found[`${module}/requirements.txt`];
  return {
    module, manifest: parseManifest(manifestName ? found[manifestName] : undefined),
    requirements: requirements ? strFromU8(requirements) : '', bytes,
  };
};

export { readApworld };
