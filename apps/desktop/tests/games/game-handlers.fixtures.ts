/* @layer tests @kind fixture */
import type { CatalogEntry, InstalledGame, InstallFailure } from '@archipelia/model';
import type { GameRow } from '../../src/views/GameStore/GameStore.type';

const noop = () => {};

const entry: CatalogEntry = { apworld: 'hk', game: 'HK', displayName: 'Hollow Knight', tags: [], source: 'official', stability: 'unknown', versions: [] };

const row: GameRow = { entry, state: 'available' };

const installedGame = { apworld: 'hk', game: 'HK', version: '1', source: 'official', installedAt: 0 } as GameRow['installed'];

const handlers = (busy: string[], errors: Record<string, string> = {}, needs: Record<string, InstallFailure> = {}) => ({
  isBusy: (key: string) => busy.includes(key), errorOf: (key: string) => errors[key] ?? null, needOf: (key: string) => needs[key], open: noop, installWorld: noop, remove: noop, openHome: noop, getPackage: noop,
});

const worldEntry = (apworld: string, source: CatalogEntry['source'], versions: string[] = []): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source, stability: 'unknown',
  versions: versions.map((version) => ({ version, url: `https://x/${version}` })),
});

const worldInstalled = (apworld: string, version: string): InstalledGame =>
  ({ apworld, game: apworld.toUpperCase(), version, source: 'index', installedAt: 0 } as InstalledGame);

export { entry, handlers, installedGame, row, worldEntry, worldInstalled };
