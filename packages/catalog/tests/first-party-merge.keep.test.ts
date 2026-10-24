/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry } from '@archipelia/model';
import { mergeCatalog } from '../src/first-party/merge-catalog';
import { communityEntry } from './first-party.fixtures';

const firstParty = (apworld: string, patch: Partial<CatalogEntry> = {}): CatalogEntry => ({
  apworld, game: apworld, displayName: 'First', home: 'https://home', tags: ['action'], source: 'first-party', stability: 'unknown',
  versions: [{ version: '0.1.0', url: 'https://github.com/x/y/releases/latest/download/a.apworld', sha256: 'a'.repeat(64) }],
  firstParty: { client: 'c', bundleUrl: 'https://b' }, ...patch,
});

describe('mergeCatalog', () => {
  test('keeps the community entries and adds the first-party ones', () => {
    const merged = mergeCatalog([communityEntry('alpha')], [firstParty('beta')]);
    expect(merged.map((entry) => [entry.apworld, entry.source])).toEqual([['alpha', 'index'], ['beta', 'first-party']]);
  });

  test('on a module collision the first-party entry wins and carries its own versions', () => {
    const community = communityEntry('relic_of_the_past', { setupGuide: 'https://guide', tracker: 'https://tracker' });
    const merged = mergeCatalog([communityEntry('alpha'), community], [firstParty('relic_of_the_past')]);
    const winner = merged.filter((entry) => entry.apworld === 'relic_of_the_past');
    expect(winner).toHaveLength(1);
    expect(winner[0]).toMatchObject({ source: 'first-party', displayName: 'First', tags: ['action'] });
    expect(winner[0]?.versions.map((version) => version.version)).toEqual(['0.1.0']);
    expect(winner[0]).toMatchObject({ setupGuide: 'https://guide', tracker: 'https://tracker' });
  });

  test('a first-party entry with no release still replaces the community one', () => {
    const merged = mergeCatalog([communityEntry('relic_of_the_past')], [firstParty('relic_of_the_past', { versions: [], unavailable: 'No release yet' })]);
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ source: 'first-party', versions: [], unavailable: 'No release yet' });
  });

  test('a world that ships with the engine is never replaced', () => {
    const official = communityEntry('relic_of_the_past', { source: 'official', versions: [] });
    const merged = mergeCatalog([official], [firstParty('relic_of_the_past')]);
    expect(merged.map((entry) => entry.source)).toEqual(['official']);
  });
});
