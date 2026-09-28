/* @layer core @kind logic */
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readRuntime } from '@archipelia/engine';
import type { CatalogEntry } from '@archipelia/model';
import { officialDir } from './official-dir';
import { readOfficialIndex } from './read-official-index';

const officialEntries = async (engineDir: string): Promise<CatalogEntry[]> => {
  const [runtime, dir, index] = await Promise.all([readRuntime(engineDir), officialDir(engineDir), readOfficialIndex(engineDir)]);
  return index.map((world) => ({
    apworld: world.apworld,
    game: world.game,
    displayName: world.game,
    tags: [],
    source: 'official',
    stability: 'unknown',
    versions: [{ version: runtime.apVersion, url: pathToFileURL(join(dir, world.file)).href, sha256: world.sha256 }],
    requires: world.requires,
  }));
};

export { officialEntries };
