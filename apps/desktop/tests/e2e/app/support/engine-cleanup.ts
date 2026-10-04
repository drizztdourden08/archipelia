/* @layer tests @kind helper */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { listInstalled, removeWorld } from '@archipelia/catalog';
import { ENGINE_DIR } from '../../support/e2e-inputs';
import { dataFilesAt } from '../../support/temp-file-store';

const BASE_WORLDS = ['_bizhawk', '_sc2common', 'generic'];

const removeLeftWorlds = async (userData: string) => {
  const files = dataFilesAt(join(userData, 'Data', 'games'));
  const left = await listInstalled(files);
  for (const game of left) await removeWorld({ engineDir: ENGINE_DIR, files, apworld: game.apworld });
  return left.map((game) => game.apworld);
};

const engineLeftovers = async () => {
  const custom = await readdir(join(ENGINE_DIR, 'ap', 'custom_worlds'));
  const folders = (await readdir(join(ENGINE_DIR, 'ap', 'worlds'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== '__pycache__' && !BASE_WORLDS.includes(entry.name))
    .map((entry) => entry.name);
  return [...custom.map((name) => `custom_worlds/${name}`), ...folders.map((name) => `worlds/${name}`)];
};

export { engineLeftovers, removeLeftWorlds };
