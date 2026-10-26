/* @layer core @kind logic */
import { readFile } from 'node:fs/promises';
import { ZIP_LIMITS, unzipCapped } from '@archipelia/model/zip';
import type { WheelMetadata } from './wheel.type';
import { MAX_METADATA_BYTES, METADATA_ENTRY } from './wheel.constants';
import { parseWheelMetadata } from './parse-wheel-metadata';
import { wheelModules } from './wheel-modules';

const readWheelMetadata = async (file: string): Promise<WheelMetadata> => {
  const { names, files } = unzipCapped(new Uint8Array(await readFile(file)), ZIP_LIMITS, (entry) => METADATA_ENTRY.test(entry.name) && entry.size <= MAX_METADATA_BYTES);
  const found = Object.keys(files);
  const [entry] = found;
  const bytes = entry === undefined ? undefined : files[entry];
  if (found.length !== 1 || bytes === undefined) throw new Error('The wheel has no single METADATA file');
  return { ...parseWheelMetadata(new TextDecoder().decode(bytes)), modules: wheelModules(names) };
};

export { readWheelMetadata };
