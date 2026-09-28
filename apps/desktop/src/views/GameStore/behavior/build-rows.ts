/* @layer renderer-app @kind logic */
import type { CatalogEntry, CatalogVersion, InstalledGame } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import type { GameRow, GameRowState } from '../GameStore.type';

const latestOf = (entry: CatalogEntry) => [...entry.versions].sort((a, b) => compareVersions(b.version, a.version))[0];

const stateOf = (entry: CatalogEntry, installed: InstalledGame | undefined, latest: CatalogVersion | undefined): GameRowState => {
  if (!installed) return 'available';
  if (entry.source === 'index' && latest && compareVersions(latest.version, installed.version) > 0) return 'update';
  return 'installed';
};

const buildRows = (entries: CatalogEntry[], installed: InstalledGame[]): GameRow[] => {
  const byWorld = new Map(installed.map((game) => [game.apworld, game]));
  const seen = new Set<string>();
  return entries
    .filter((entry) => entry.source !== 'official' || !seen.has(entry.apworld))
    .filter((entry) => entry.source === 'official' || entry.versions.length > 0)
    .map((entry) => {
      seen.add(entry.apworld);
      const latest = latestOf(entry);
      const game = byWorld.get(entry.apworld);
      return { entry, installed: game, latest, state: stateOf(entry, game, latest) };
    });
};

export { buildRows };
