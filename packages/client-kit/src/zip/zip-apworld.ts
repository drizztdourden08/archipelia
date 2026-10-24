/* @layer client-kit @kind logic */
import { zipSync } from 'fflate';
import type { Zippable, ZipOptions } from 'fflate';
import type { ApworldEntry } from './zip.type';
import { createKitError } from '../errors/create-kit-error';
import { checkEntryPath } from './check-entry-path';
import { comparePaths } from './compare-paths';
import { DEFLATE_LEVEL, FILE_ATTRIBUTES, FIXED_TIME, UNIX_HOST } from './zip.constants';

const zipApworld = (entries: readonly ApworldEntry[]): Uint8Array => {
  const sorted = [...entries].sort((a, b) => comparePaths(a.path, b.path));
  sorted.forEach(({ path }, index) => {
    checkEntryPath(path);
    if (index > 0 && sorted[index - 1]?.path === path) throw createKitError('invalid-package', `"${path}" appears twice in the apworld.`);
  });
  const options: ZipOptions = { level: DEFLATE_LEVEL, mtime: FIXED_TIME, os: UNIX_HOST, attrs: FILE_ATTRIBUTES };
  const files: Zippable = Object.fromEntries(sorted.map(({ path, bytes }) => [path, [bytes, options] as [Uint8Array, ZipOptions]]));
  return zipSync(files);
};

export { zipApworld };
