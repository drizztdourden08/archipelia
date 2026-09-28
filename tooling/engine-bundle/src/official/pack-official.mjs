/* @layer tooling-scripts @kind logic */
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exists } from '../download.mjs';
import { looseWorldGames } from './loose-worlds.mjs';
import { packWorld, pythonSources, readWorld } from './pack-world.mjs';
import { gameOfWorld, loadedGames } from './world-games.mjs';
import { officialWorldNames } from './world-folders.mjs';
import { worldImports } from './world-imports.mjs';

const OFFICIAL_DIR = 'official';
const INDEX_FILE = 'index.json';

const packAll = async ({ out, python, into, onLine }) => {
  const apDir = join(out, 'ap');
  const worldsDir = join(apDir, 'worlds');
  const names = await officialWorldNames(worldsDir);
  const official = new Set(names);
  const { games, failed } = await loadedGames({ python: join(out, python), apDir, onLine });
  if (failed.length > 0) (onLine ?? console.warn)(`worlds that did not load: ${failed.join(', ')}`);
  const globalIgnore = (await readFile(join(apDir, 'data', 'GLOBAL.apignore'), 'utf8')).split(/\r?\n/);
  const loose = await looseWorldGames(apDir);
  const index = [];
  for (const name of names) {
    const world = await readWorld({ worldsDir, globalIgnore, name });
    const sources = pythonSources(world);
    const game = gameOfWorld({ loaded: games[name], manifest: world.manifest, files: sources });
    if (!game) throw new Error(`${name}: no game name found`);
    const { file, sha256, worldVersion } = await packWorld(world, game, into);
    const layout = loose.has(game) ? 'folder' : 'apworld';
    index.push({ apworld: name, game, file, sha256, layout, worldVersion, ...worldImports(sources, name, official) });
  }
  return index;
};

const packOfficial = async ({ out, python, onLine }) => {
  const dir = join(out, OFFICIAL_DIR);
  const indexFile = join(dir, INDEX_FILE);
  if (!(await exists(indexFile))) {
    const part = `${dir}.part`;
    await rm(part, { recursive: true, force: true });
    await mkdir(part, { recursive: true });
    const index = await packAll({ out, python, into: part, onLine });
    await writeFile(join(part, INDEX_FILE), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
    await rename(part, dir);
  }
  const index = JSON.parse(await readFile(indexFile, 'utf8'));
  await Promise.all(index.map((entry) => rm(join(out, 'ap', 'worlds', entry.apworld), { recursive: true, force: true })));
  return index;
};

export { OFFICIAL_DIR, packOfficial };
