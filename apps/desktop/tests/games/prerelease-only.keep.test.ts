/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { handlers as handlersOf } from './game-handlers.fixtures';

const handlers = handlersOf([]);

const rotp = (prerelease: boolean): CatalogEntry => ({
  apworld: 'relic_of_the_past', game: 'Relic of the Past', displayName: 'Relic of the Past', tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '0.21.2', url: 'https://x/relic.apworld' }],
  firstParty: { repo: 'x/relic', bundleUrl: 'https://x/bundle', ...(prerelease ? { tag: 'v0.21.2', prerelease: true } : {}) },
});

const record = (patch: Partial<InstalledGame> = {}) =>
  ({ apworld: 'relic_of_the_past', game: 'Relic of the Past', version: '0.21.2', source: 'first-party', installedAt: 0, ...patch }) as InstalledGame;

const rowOf = (entry: CatalogEntry, installed: InstalledGame[] = []) => {
  const [row] = buildRows([entry], installed);
  if (!row) throw new Error('no row');
  return row;
};

describe('a world whose newest release is a pre-release', () => {
  test('the card and the dialog carry the Pre-release tag, a stable world does not', () => {
    expect(cardPropsOf(rowOf(rotp(true)), handlers).prerelease).toBe(true);
    expect(cardPropsOf(rowOf(rotp(false)), handlers).prerelease).toBeUndefined();
  });

  test('installed at the newest pre-release shows no update', () => {
    const installed = record({ release: { tag: 'v0.21.2', prerelease: true } });
    expect(rowOf(rotp(true), [installed]).state).toBe('installed');
    expect(rowOf(rotp(true), [record()]).state).toBe('installed');
  });

  test('an older install updates to the newest pre-release, and a newer pre-release of the same core does too', () => {
    expect(rowOf(rotp(true), [record({ version: '0.21.1' })]).state).toBe('update');
    expect(cardPropsOf(rowOf(rotp(true), [record({ version: '0.21.1' })]), handlers).prerelease).toBe(true);
    const next = { ...rotp(true), versions: [{ version: '0.21.2-rc2', url: 'https://x/relic.apworld' }] };
    expect(rowOf(next, [record({ version: '0.21.2-rc1', release: { tag: 'v0.21.2-rc1', prerelease: true } })]).state).toBe('update');
  });
});
