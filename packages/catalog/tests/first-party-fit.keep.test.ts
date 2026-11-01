/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry } from '@archipelia/model';
import { engineFit } from '../src/first-party/engine-fit';
import { fitEntries } from '../src/first-party/fit-entries';
import { communityEntry } from './first-party.fixtures';

const build = (ap: string) => ({ archipelagoVersion: ap, url: `https://x/${ap}.apworld`, bundleUrl: `https://x/${ap}.sigstore.json`, sha256: ap.padEnd(64, '0'), size: 10 });

const buildsEntry = (aps: string[], patch: Partial<CatalogEntry> = {}): CatalogEntry => entryOf({ minimumAp: aps[0], maximumAp: aps[aps.length - 1] }, {
  versions: [],
  firstParty: { client: 'c', bundleUrl: 'u', minimumAp: aps[0], maximumAp: aps[aps.length - 1], worldVersion: '0.1.0', builds: aps.map(build) },
  ...patch,
});

const release = (range: { minimumAp?: string; maximumAp?: string }) => ({ client: 'c', bundleUrl: 'u', ...range });

const entryOf = (range: { minimumAp?: string; maximumAp?: string }, patch: Partial<CatalogEntry> = {}): CatalogEntry =>
  communityEntry('relic_of_the_past', { source: 'first-party', displayName: 'Relic of the Past', firstParty: release(range), ...patch });

describe('engineFit', () => {
  test('K1 fits inside the declared range, edges included', { tags: ['critical'] }, () => {
    const range = release({ minimumAp: '0.6.4', maximumAp: '0.7.0' });
    expect(engineFit(range, '0.6.4')).toBeUndefined();
    expect(engineFit(range, '0.7.0')).toBeUndefined();
  });

  test('K1 an absent maximum is open ended', { tags: ['critical'] }, () => {
    expect(engineFit(release({ minimumAp: '0.6.4' }), '1.2.0')).toBeUndefined();
  });

  test('K1 names the minimum when the engine is older', { tags: ['critical'] }, () => {
    expect(engineFit(release({ minimumAp: '0.6.4' }), '0.6.2')).toBe('Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2');
  });

  test('K1 names the maximum when the engine is newer', { tags: ['critical'] }, () => {
    expect(engineFit(release({ maximumAp: '0.6.9' }), '0.7.0')).toBe('Needs Archipelago 0.6.9 or older, the active engine is 0.7.0');
  });
});

describe('fitEntries', () => {
  test('K1 marks a first-party entry that does not fit the active engine, with the reason', { tags: ['critical'] }, () => {
    const [fitted] = fitEntries([entryOf({ minimumAp: '0.6.4' })], '0.6.2');
    expect(fitted?.unavailable).toContain('Needs Archipelago 0.6.4 or newer');
  });

  test('K1 leaves a fitting entry, a community entry and an unknown engine alone', { tags: ['critical'] }, () => {
    const fits = entryOf({ minimumAp: '0.6.4' });
    expect(fitEntries([fits], '0.6.7')[0]).toBe(fits);
    expect(fitEntries([fits], undefined)[0]).toBe(fits);
    const community = communityEntry('alpha');
    expect(fitEntries([community], '0.1.0')[0]).toBe(community);
  });

  test('K1 keeps No release yet over a version reason', { tags: ['critical'] }, () => {
    const none = entryOf({}, { unavailable: 'No release yet', versions: [] });
    expect(fitEntries([none], '0.1.0')[0]?.unavailable).toBe('No release yet');
  });

  test('K1 does not change the entry it was given', { tags: ['critical'] }, () => {
    const entry = entryOf({ minimumAp: '0.6.4' });
    fitEntries([entry], '0.6.2');
    expect(entry.unavailable).toBeUndefined();
  });
});

describe('fitEntries with per-version builds', () => {
  test('K1 picks the build whose Archipelago version equals the engine and makes it the version to install', { tags: ['critical'] }, () => {
    const [fitted] = fitEntries([buildsEntry(['0.6.5', '0.6.7', '0.6.9'])], '0.6.7');
    expect(fitted?.unavailable).toBeUndefined();
    expect(fitted?.versions).toEqual([{ version: '0.1.0', url: 'https://x/0.6.7.apworld', sha256: '0.6.7'.padEnd(64, '0'), size: 10 }]);
  });

  test('K1 with no build for the engine it is not available, and the range does not matter', { tags: ['critical'] }, () => {
    const [fitted] = fitEntries([buildsEntry(['0.6.5', '0.6.9'])], '0.6.7');
    expect(fitted?.versions).toEqual([]);
    expect(fitted?.unavailable).toBe('No Relic of the Past build for Archipelago 0.6.7; builds exist for 0.6.5, 0.6.9');
  });

  test('K1 an engine newer than the last build is not available either', { tags: ['critical'] }, () => {
    expect(fitEntries([buildsEntry(['0.6.5', '0.6.7'])], '0.7.0')[0]?.unavailable).toContain('No Relic of the Past build for Archipelago 0.7.0');
  });

  test('K1 a build index is untouched when the engine is unknown', { tags: ['critical'] }, () => {
    const entry = buildsEntry(['0.6.7']);
    expect(fitEntries([entry], undefined)[0]).toBe(entry);
  });
});
