/* @layer tooling-scripts @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const NON_APWORLDS = /^non_apworlds\b[^=\n]*=\s*\{([^}]*)\}/m;

const parseLooseGames = (setupSource) => {
  const block = NON_APWORLDS.exec(setupSource)?.[1];
  if (block === undefined) return undefined;
  return new Set([...block.matchAll(/(["'])(.+?)\1/g)].map((m) => m[2]));
};

const looseWorldGames = async (apDir) => {
  const games = parseLooseGames(await readFile(join(apDir, 'setup.py'), 'utf8'));
  if (!games) throw new Error('setup.py: non_apworlds not found, cannot tell which worlds must stay loose folders');
  return games;
};

export { looseWorldGames, parseLooseGames };
