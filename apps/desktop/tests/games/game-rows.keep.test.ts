/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { compareVersions } from '../../src/views/GameStore/behavior/compare-versions';
import { filterRows } from '../../src/views/GameStore/behavior/filter-rows';

const entry = (apworld: string, source: CatalogEntry['source'], versions: string[] = []): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source, stability: 'unknown',
  versions: versions.map((version) => ({ version, url: `https://x/${version}` })),
});
const installed = (apworld: string, version: string): InstalledGame =>
  ({ apworld, game: apworld.toUpperCase(), version, source: 'index', installedAt: 0 } as InstalledGame);

describe('game rows', () => {
  test('versions compare numerically', () => {
    expect(compareVersions('1.10.0', '1.9.2')).toBeGreaterThan(0);
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
  });

  test('an older installed version is an update, official worlds need no versions', () => {
    const rows = buildRows([entry('hk', 'official'), entry('soh', 'index', ['1.1.0', '1.2.1']), entry('none', 'index')], [installed('soh', '1.1.0')]);
    expect(rows.map((r) => [r.entry.apworld, r.state])).toEqual([['hk', 'available'], ['soh', 'update']]);
    expect(rows[1]?.latest?.version).toBe('1.2.1');
  });

  test('tabs and search filter the rows', () => {
    const rows = buildRows([entry('hk', 'official'), entry('soh', 'index', ['1.0.0'])], [installed('soh', '1.0.0')]);
    expect(filterRows(rows, 'installed', '').map((r) => r.entry.apworld)).toEqual(['soh']);
    expect(filterRows(rows, 'official', '').map((r) => r.entry.apworld)).toEqual(['hk']);
    expect(filterRows(rows, 'community', 'SO').map((r) => r.entry.apworld)).toEqual(['soh']);
  });
});
