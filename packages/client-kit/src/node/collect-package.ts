/* @layer client-kit @kind logic */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ApworldEntry } from '../zip/zip.type';
import type { CollectOptions } from './node.type';
import { createKitError } from '../errors/create-kit-error';
import { normalizeLineEndings } from './normalize-line-endings';
import { SKIPPED_NAMES, SKIPPED_SUFFIXES } from './node.constants';

const walk = async (root: string, relative: string, options: CollectOptions, out: ApworldEntry[]): Promise<void> => {
  const names = (await readdir(join(root, relative), { withFileTypes: true })).sort((a, b) => (a.name < b.name ? -1 : 1));
  for (const entry of names) {
    const path = relative === '' ? entry.name : `${relative}/${entry.name}`;
    if (SKIPPED_NAMES.has(entry.name) || SKIPPED_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) continue;
    if (options.exclude?.includes(path)) continue;
    if (entry.isSymbolicLink()) throw createKitError('invalid-package', `${path} is a link, which an apworld cannot hold.`);
    if (entry.isDirectory()) {
      await walk(root, path, options, out);
      continue;
    }
    const bytes = new Uint8Array(await readFile(join(root, path)));
    out.push({ path, bytes: options.lineEndings === 'keep' ? bytes : normalizeLineEndings(path, bytes) });
  }
};

const collectPackage = async (root: string, options: CollectOptions = {}): Promise<ApworldEntry[]> => {
  const out: ApworldEntry[] = [];
  try {
    await walk(root, '', options, out);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw createKitError('invalid-package', `The folder ${root} does not exist.`);
    throw error;
  }
  return out;
};

export { collectPackage };
