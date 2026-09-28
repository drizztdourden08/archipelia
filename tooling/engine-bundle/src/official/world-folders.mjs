/* @layer tooling-scripts @kind logic */
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { exists } from '../download.mjs';

const KEPT_FOLDERS = new Set(['generic']);

const isOfficialName = (name) => !name.startsWith('_') && !name.startsWith('.') && !KEPT_FOLDERS.has(name);

const officialWorldNames = async (worldsDir) => {
  const dirs = (await readdir(worldsDir, { withFileTypes: true })).filter((d) => d.isDirectory() && isOfficialName(d.name));
  const withInit = await Promise.all(dirs.map(async (d) => ((await exists(join(worldsDir, d.name, '__init__.py'))) ? d.name : undefined)));
  return withInit.filter((name) => name !== undefined).sort();
};

const listFiles = async (dir) => {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((e) => e.isFile()).map((e) => relative(dir, join(e.parentPath, e.name)).split(sep).join('/')).sort();
};

export { listFiles, officialWorldNames };
