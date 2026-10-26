/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { groupSections } from '../../src/views/GameStore/behavior/group-sections';

const noop = () => {};
const handlers = { isBusy: () => false, errorOf: () => null, needOf: () => undefined, open: noop, installWorld: noop, remove: noop, openHome: noop, getPackage: noop };

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
  test('a first-party game is in the Community section with its own kind, its world version and an Add button', () => {
    const rows = buildRows([firstParty()], []);
    expect(groupSections(rows).map((section) => [section.id, section.rows.length])).toEqual([['installed', 0], ['official', 0], ['community', 1]]);
    const card = cardOf(firstParty());
    expect(card).toMatchObject({ kind: 'first-party', version: '0.1.0', status: undefined });
    expect(card.actions[0]).toMatchObject({ label: 'Add', disabled: false });
  });

  test('with no release it shows one state, No release yet, and has no Add button', () => {
    const card = cardOf(firstParty({ versions: [], unavailable: 'No release yet' }));
    expect(card.status).toBe('no-release');
    expect(card.notes).toEqual([]);
    expect(card.kind).toBe('first-party');
    expect(card.actions.map((action) => action.label)).not.toContain('Add');
  });

  test('an engine that does not fit shows one state with the reason as a note and disables Add', () => {
    const reason = 'Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2';
    const card = cardOf(firstParty({ unavailable: reason }));
    expect(card.status).toBe('unavailable');
    expect(card.notes).toContainEqual(expect.objectContaining({ text: reason }));
    expect(card.actions[0]).toMatchObject({ disabled: true });
  });

  test('shows the declared Archipelago range as information only', () => {
    const both = cardOf(firstParty({ firstParty: { client: 'c', bundleUrl: 'b', minimumAp: '0.6.5', maximumAp: '0.6.9' } }));
    expect(both.notes).toContainEqual(expect.objectContaining({ text: 'Archipelago 0.6.5 to 0.6.9' }));
    expect(both.actions[0]).toMatchObject({ disabled: false });
  });

  test('an installed game shows its version and its verification note, verified or not yet', () => {
    const detail = 'Not verified yet: this release has no attestation bundle.';
    const unverified = cardOf(firstParty(), [record({ trust: { state: 'unverified', detail } })]);
    expect(unverified.version).toBe('0.1.0');
    expect(unverified.notes).toEqual([expect.objectContaining({ text: detail, warning: true })]);
    const verified = cardOf(firstParty(), [record({ trust: { state: 'verified', detail: 'Verified: signed by owner/repo' } })]);
    expect(verified.notes).toEqual([expect.objectContaining({ text: 'Verified: signed by owner/repo', warning: false })]);
  });
});
