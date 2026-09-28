/* @layer tooling-scripts @kind logic */
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { run } from '../run.mjs';
import { initFirst, parseGameName } from './game-name.mjs';

const LIST_GAMES = [
  'import json, os, sys',
  'sys.path.insert(0, os.getcwd())',
  'from worlds import AutoWorldRegister, failed_world_loads',
  'games = {}',
  'for game, world in AutoWorldRegister.world_types.items():',
  '    games.setdefault(world.__module__.split(".")[1], []).append(game)',
  'json.dump({"games": games, "failed": failed_world_loads}, open(sys.argv[1], "w", encoding="utf-8"))',
].join('\n');

const loadedGames = async ({ python, apDir, onLine }) => {
  const out = join(apDir, '..', 'world-games.json');
  const env = { ...process.env, SKIP_REQUIREMENTS_UPDATE: '1', PYTHONUTF8: '1' };
  try {
    await run(python, ['-X', 'utf8', '-c', LIST_GAMES, out], { cwd: apDir, env, onLine });
    return JSON.parse(await readFile(out, 'utf8'));
  } finally {
    await rm(out, { force: true });
  }
};

const gameOfWorld = ({ loaded, manifest, files }) => {
  if (loaded?.length === 1) return loaded[0];
  if (loaded && loaded.length > 1) throw new Error(`one world folder registers several games: ${loaded.join(', ')}`);
  return manifest?.game ?? parseGameName(initFirst(files));
};

export { gameOfWorld, loadedGames };
