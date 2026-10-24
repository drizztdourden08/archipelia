/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry } from '@archipelia/model';
import { assertReleaseFits } from '../src/first-party/assert-release-fits';
import { engineFit } from '../src/first-party/engine-fit';
import { fitEntries } from '../src/first-party/fit-entries';
import { communityEntry } from './first-party.fixtures';

const release = (range: { minimumAp?: string; maximumAp?: string }) => ({ client: 'c', bundleUrl: 'u', ...range });

const entryOf = (range: { minimumAp?: string; maximumAp?: string }, patch: Partial<CatalogEntry> = {}): CatalogEntry =>
  communityEntry('relic_of_the_past', { source: 'first-party', displayName: 'Relic of the Past', firstParty: release(range), ...patch });

describe('engineFit', () => {
  test('fits inside the declared range, edges included', () => {
    const range = release({ minimumAp: '0.6.4', maximumAp: '0.7.0' });
    expect(engineFit(range, '0.6.4')).toBeUndefined();
    expect(engineFit(range, '0.7.0')).toBeUndefined();
  });

  test('an absent maximum is open ended', () => {
    expect(engineFit(release({ minimumAp: '0.6.4' }), '1.2.0')).toBeUndefined();
  });

  test('names the minimum when the engine is older', () => {
    expect(engineFit(release({ minimumAp: '0.6.4' }), '0.6.2')).toBe('Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2');
  });

  test('names the maximum when the engine is newer', () => {
    expect(engineFit(release({ maximumAp: '0.6.9' }), '0.7.0')).toBe('Needs Archipelago 0.6.9 or older, the active engine is 0.7.0');
  });
});

describe('fitEntries', () => {
  test('marks a first-party entry that does not fit the active engine, with the reason', () => {
    const [fitted] = fitEntries([entryOf({ minimumAp: '0.6.4' })], '0.6.2');
    expect(fitted?.unavailable).toContain('Needs Archipelago 0.6.4 or newer');
  });

  test('leaves a fitting entry, a community entry and an unknown engine alone', () => {
    const fits = entryOf({ minimumAp: '0.6.4' });
    expect(fitEntries([fits], '0.6.7')[0]).toBe(fits);
    expect(fitEntries([fits], undefined)[0]).toBe(fits);
    const community = communityEntry('alpha');
    expect(fitEntries([community], '0.1.0')[0]).toBe(community);
  });

  test('keeps No release yet over a version reason', () => {
    const none = entryOf({}, { unavailable: 'No release yet', versions: [] });
    expect(fitEntries([none], '0.1.0')[0]?.unavailable).toBe('No release yet');
  });

  test('does not change the entry it was given', () => {
    const entry = entryOf({ minimumAp: '0.6.4' });
    fitEntries([entry], '0.6.2');
    expect(entry.unavailable).toBeUndefined();
  });
});

describe('assertReleaseFits', () => {
  test('throws the reason when the engine does not fit and passes otherwise', () => {
    expect(() => assertReleaseFits(entryOf({ minimumAp: '0.6.4' }), '0.6.2')).toThrow(/Relic of the Past is not available for this engine: Needs Archipelago 0.6.4/);
    expect(() => assertReleaseFits(entryOf({ minimumAp: '0.6.4' }), '0.6.4')).not.toThrow();
  });
});
