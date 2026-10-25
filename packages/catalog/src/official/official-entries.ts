/* @layer core @kind logic */
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readRuntime } from '@archipelia/engine';
import type { CatalogEntry, CatalogVersion } from '@archipelia/model';
import { officialDir } from './official-dir';
import type { OfficialWorld } from './official-index.type';
import { readOfficialIndex } from './read-official-index';

const ownVersions = (world: OfficialWorld, apVersion: string, dir: string): CatalogVersion[] => {
  if (!world.worldVersion || world.worldVersion === apVersion) return [];
  return [{ version: world.worldVersion, url: pathToFileURL(join(dir, world.file)).href, sha256: world.sha256 }];
};

const officialEntries = async (engineDir: string): Promise<CatalogEntry[]> => {
  const [runtime, dir, index] = await Promise.all([readRuntime(engineDir), officialDir(engineDir), readOfficialIndex(engineDir)]);
  return index.map((world) => ({
    apworld: world.apworld,
    game: world.game,
    displayName: world.game,
    tags: [],
    source: 'official',
    stability: 'unknown',
    versions: ownVersions(world, runtime.apVersion, dir),
    requires: world.requires,
  }));
};

export { officialEntries };
