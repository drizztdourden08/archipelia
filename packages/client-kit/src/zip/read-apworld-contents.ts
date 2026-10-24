/* @layer client-kit @kind logic */
import { strFromU8, unzipSync } from 'fflate';
import type { ApworldContents } from './zip.type';
import { createKitError } from '../errors/create-kit-error';
import { MANIFEST_FILE } from '../manifest/manifest.constants';
import { MAX_MANIFEST_BYTES } from './zip.constants';

const fail = (message: string): never => {
  throw createKitError('invalid-apworld', `Not a valid apworld: ${message}`);
};

const unzipNames = (bytes: Uint8Array, wanted: (name: string, size: number) => boolean): { names: string[]; found: Record<string, Uint8Array> } => {
  const names: string[] = [];
  try {
    const found = unzipSync(bytes, {
      filter: ({ name, originalSize }) => {
        names.push(name);
        return wanted(name, originalSize);
      },
    });
    return { names, found };
  } catch {
    return fail('the bytes are not a zip file.');
  }
};

const readApworldContents = (bytes: Uint8Array): ApworldContents => {
  const manifestPath = (name: string): boolean => name.split('/').length === 2 && name.endsWith(`/${MANIFEST_FILE}`);
  const { names, found } = unzipNames(bytes, (name, size) => manifestPath(name) && size <= MAX_MANIFEST_BYTES);
  const modules = new Set(names.map((name) => name.split('/')[0] ?? ''));
  if (modules.size !== 1 || modules.has('')) return fail('it must hold exactly one top-level package folder.');
  const [module = ''] = [...modules];
  const manifest = found[`${module}/${MANIFEST_FILE}`];
  if (manifest === undefined) return fail(`${module}/${MANIFEST_FILE} is missing or too large.`);
  return { module, manifestText: strFromU8(manifest), entries: names.filter((name) => !name.endsWith('/')) };
};

export { readApworldContents };
