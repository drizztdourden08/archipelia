/* @layer testing @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FIXTURES_FOLDER, FIXTURES_MARKER, FIXTURES_SEARCH_DEPTH } from './fixtures-dir.constants';

const findFixturesDir = (): URL => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < FIXTURES_SEARCH_DEPTH; depth += 1) {
    const candidate = join(dir, FIXTURES_FOLDER);
    if (existsSync(join(candidate, FIXTURES_MARKER))) return pathToFileURL(`${candidate}${sep}`);
    dir = dirname(dir);
  }
  throw new Error('the lobby protocol fixtures folder was not found next to the package code');
};

export { findFixturesDir };
