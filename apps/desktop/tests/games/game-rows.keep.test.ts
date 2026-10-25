/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import '@drizztdourden08/tessera/field-kits';
import { createClause } from '@drizztdourden08/tessera/data';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { compareVersions } from '../../src/views/GameStore/behavior/compare-versions';
import { filterRows } from '../../src/views/GameStore/behavior/filter-rows';
import { groupSections } from '../../src/views/GameStore/behavior/group-sections';

const entry = (apworld: string, source: CatalogEntry['source'], versions: string[] = []): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source, stability: 'unknown',
  versions: versions.map((version) => ({ version, url: `https://x/${version}` })),
});
const installed = (apworld: string, version: string): InstalledGame =>
  ({ apworld, game: apworld.toUpperCase(), version, source: 'index', installedAt: 0 } as InstalledGame);

const apworldOf = (row: { entry: CatalogEntry }) => row.entry.apworld;

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

  test('sections come in the order installed, official, community', () => {
    const rows = buildRows([entry('hk', 'official'), entry('soh', 'index', ['1.0.0']), entry('rotp', 'first-party', ['0.1.0']), entry('tim', 'official')], [installed('soh', '1.0.0')]);
    expect(groupSections(rows).map((section) => [section.id, section.rows.map(apworldOf)])).toEqual([
      ['installed', ['soh']], ['official', ['hk', 'tim']], ['community', ['rotp']],
    ]);
  });

  test('search and filters cover every section at once', () => {
    const rows = buildRows([entry('hk', 'official'), entry('soh', 'index', ['1.0.0']), entry('rotp', 'first-party', ['0.1.0'])], [installed('soh', '1.0.0')]);
    const names = (query: string, clauses: ReturnType<typeof createClause>[] = []) => filterRows(rows, query, clauses).map(apworldOf);
    expect(names('')).toEqual(['hk', 'rotp', 'soh']);
    expect(names('SO')).toEqual(['soh']);
    expect(names('', [createClause('source', 'anyOf', ['Official', 'First-party'])])).toEqual(['hk', 'rotp']);
    expect(names('', [createClause('state', 'anyOf', ['Installed'])])).toEqual(['soh']);
    expect(names('', [createClause('state', 'noneOf', ['Installed']), createClause('name', 'contains', 'r')])).toEqual(['rotp']);
  });
});
