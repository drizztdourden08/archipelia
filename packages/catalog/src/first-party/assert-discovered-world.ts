/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { ApworldInfo } from '../install/read-apworld.type';

const assertDiscoveredWorld = ({ displayName, apworld, game, discovered }: CatalogEntry, info: ApworldInfo): void => {
  if (!discovered) return;
  if (info.module !== apworld) throw new Error(`${displayName} is refused: the apworld holds the world ${info.module}, the release lists ${apworld}`);
  if (info.manifest.game !== game) {
    throw new Error(`${displayName} is refused: the apworld names the game ${info.manifest.game ?? 'nothing'}, the release lists ${game}`);
  }
};

export { assertDiscoveredWorld };
