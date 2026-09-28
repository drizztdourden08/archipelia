/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { createIgnore } from './apignore.mjs';
import { listFiles } from './world-folders.mjs';

const MANIFEST = 'archipelago.json';
const CONTAINER_VERSION = 7;

const readLines = async (file) => {
  try {
    return (await readFile(file, 'utf8')).split(/\r?\n/);
  } catch {
    return [];
  }
};

const readWorld = async ({ worldsDir, globalIgnore, name }) => {
  const dir = join(worldsDir, name);
  const ignored = createIgnore([...globalIgnore, ...(await readLines(join(dir, '.apignore')))]);
  const paths = (await listFiles(dir)).filter((path) => !ignored(path));
  const files = await Promise.all(paths.map(async (path) => ({ path, bytes: await readFile(join(dir, path)) })));
  const manifestLines = await readLines(join(dir, MANIFEST));
  const manifest = manifestLines.length > 0 ? JSON.parse(manifestLines.join('\n')) : undefined;
  return { name, files, manifest };
};

const pythonSources = (world) =>
  world.files.filter((f) => f.path.endsWith('.py')).map((f) => ({ path: f.path, source: f.bytes.toString('utf8') }));

const packWorld = async (world, game, into) => {
  if (world.manifest?.game && world.manifest.game !== game) {
    throw new Error(`${world.name}: manifest game "${world.manifest.game}" is not the loaded game "${game}"`);
  }
  const manifest = { ...world.manifest, game, compatible_version: CONTAINER_VERSION, version: CONTAINER_VERSION };
  const entries = Object.fromEntries(world.files.map((f) => [`${world.name}/${f.path}`, new Uint8Array(f.bytes)]));
  entries[`${world.name}/${MANIFEST}`] = strToU8(JSON.stringify(manifest));
  const file = `${world.name}.apworld`;
  const bytes = zipSync(entries, { level: 9 });
  await writeFile(join(into, file), bytes);
  return { file, sha256: createHash('sha256').update(bytes).digest('hex'), worldVersion: manifest.world_version };
};

export { packWorld, pythonSources, readWorld };
