/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { isRecord } from '@archipelia/model';
import { APWORLD_LIMITS, unzipCapped } from '@archipelia/model/zip';
import type { ApworldRead, ApworldManifest } from './read-apworld.type';
import { MANIFEST_NAME, MAX_MANIFEST_BYTES } from './read-apworld.constants';

const text = (value: unknown) => (typeof value === 'string' ? value : undefined);

const manifestOf = (raw: unknown): ApworldManifest | null => {
  if (!isRecord(raw)) return null;
  return { game: text(raw.game), worldVersion: text(raw.world_version), minimumAp: text(raw.minimum_ap_version), maximumAp: text(raw.maximum_ap_version) };
};

const parseManifest = (bytes: Uint8Array | undefined): unknown => {
  try {
    return bytes ? JSON.parse(strFromU8(bytes)) : null;
  } catch {
    return null;
  }
};

const unzipManifest = (bytes: Uint8Array) => {
  try {
    const { names, files } = unzipCapped(bytes, APWORLD_LIMITS, (entry) =>
      entry.name.split('/').length === 2 && entry.name.endsWith(`/${MANIFEST_NAME}`) && entry.size <= MAX_MANIFEST_BYTES);
    return { names, found: files };
  } catch {
    return null;
  }
};

const readApworld = (bytes: Uint8Array): ApworldRead => {
  const unzipped = unzipManifest(bytes);
  if (!unzipped) return { ok: false, problem: 'is not a valid apworld zip' };
  const packages = new Set(unzipped.names.filter((name) => name.includes('/')).map((name) => name.split('/')[0]));
  const [module] = [...packages];
  if (packages.size !== 1 || module === undefined) return { ok: false, problem: 'must hold exactly one package' };
  const manifest = manifestOf(parseManifest(unzipped.found[`${module}/${MANIFEST_NAME}`]));
  if (!manifest) return { ok: false, problem: `has no ${MANIFEST_NAME}` };
  return { ok: true, module, manifest };
};

export { readApworld };
