/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { filterRows } from '../../src/views/GameStore/behavior/filter-rows';

const noop = () => {};
const handlers = { isBusy: () => false, installWorld: noop, remove: noop, openHome: noop };

const firstParty = (patch: Partial<CatalogEntry> = {}): CatalogEntry => ({
  apworld: 'relic_of_the_past', game: 'Relic of the Past', displayName: 'Relic of the Past', tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '0.1.0', url: 'https://x/relic.apworld', sha256: 'a'.repeat(64) }],
  firstParty: { client: 'relic-of-the-past', bundleUrl: 'https://x/bundle' }, ...patch,
});

const record = (patch: Partial<InstalledGame> = {}) =>
  ({ apworld: 'relic_of_the_past', game: 'Relic of the Past', version: '0.1.0', source: 'first-party', installedAt: 0, ...patch }) as InstalledGame;

const cardOf = (entry: CatalogEntry, installed: InstalledGame[] = []) => {
  const [row] = buildRows([entry], installed);
  if (!row) throw new Error('no row');
  return cardPropsOf(row, handlers);
};

describe('first-party games in the store', () => {
  test('a first-party game is in the Community tab with the First-party tag and an Add button', () => {
    const rows = buildRows([firstParty()], []);
    expect(filterRows(rows, 'community', '').map((row) => row.entry.apworld)).toEqual(['relic_of_the_past']);
    const card = cardOf(firstParty());
    expect(card).toMatchObject({ tag: 'First-party', details: ['Latest 0.1.0'] });
    expect(card.actions[0]).toMatchObject({ label: 'Add', disabled: false });
  });

  test('with no release it is still listed, says No release yet and has no Add button', () => {
    const card = cardOf(firstParty({ versions: [], unavailable: 'No release yet' }));
    expect(card.status).toEqual({ label: 'Not available', tone: 'neutral' });
    expect(card.details).toEqual(['No release yet']);
    expect(card.tag).toBe('First-party');
    expect(card.actions.map((action) => action.label)).not.toContain('Add');
  });

  test('an engine that does not fit shows the reason and disables Add', () => {
    const reason = 'Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2';
    const card = cardOf(firstParty({ unavailable: reason }));
    expect(card.details).toContain(reason);
    expect(card.actions[0]).toMatchObject({ disabled: true });
  });

  test('an installed game shows its verification line, verified or not yet', () => {
    const unverified = cardOf(firstParty(), [record({ trust: { state: 'unverified', detail: 'Not verified yet: this release has no attestation bundle.' } })]);
    expect(unverified.details).toEqual(['Installed 0.1.0', 'Not verified yet: this release has no attestation bundle.']);
    const verified = cardOf(firstParty(), [record({ trust: { state: 'verified', detail: 'Verified: signed by owner/repo' } })]);
    expect(verified.details).toContain('Verified: signed by owner/repo');
  });
});
