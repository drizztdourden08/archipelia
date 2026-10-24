/* @layer testing @kind logic */
import type { ApworldSpec, ZipEntry } from './kit.type';
import { buildZip } from './build-zip';
import { fillerBytes } from './filler-bytes';

const manifestOf = (spec: ApworldSpec): Record<string, string | number> => {
  const manifest: Record<string, string | number> = {
    game: spec.game,
    world_version: spec.worldVersion,
    version: 7,
    compatible_version: 7,
  };
  if (spec.minimumAp !== undefined) manifest.minimum_ap_version = spec.minimumAp;
  if (spec.maximumAp !== undefined) manifest.maximum_ap_version = spec.maximumAp;
  return manifest;
};

const entriesFor = (spec: ApworldSpec, padding: number): ZipEntry[] => [
  { name: `${spec.module}/__init__.py`, data: Buffer.from('# generated test world\n', 'utf8') },
  { name: `${spec.module}/archipelago.json`, data: Buffer.from(JSON.stringify(manifestOf(spec)), 'utf8') },
  { name: `${spec.module}/padding.bin`, data: fillerBytes(padding, spec.size) },
];

const makeApworld = (spec: ApworldSpec): Uint8Array => {
  const base = buildZip(entriesFor(spec, 0)).length;
  if (spec.size < base) throw new Error(`a world of ${spec.size} bytes cannot hold its own files`);
  return buildZip(entriesFor(spec, spec.size - base));
};

export { makeApworld };
