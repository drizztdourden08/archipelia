/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import type { InstallRequest } from '@archipelia/catalog';

const confirmAction = vi.hoisted(() => vi.fn());

vi.mock('@drizztdourden08/brock-react', async (original) => ({ ...(await original<object>()), confirmAction }));

const { handlers: fixtureHandlers, rowFor: rowOf } = await import('./game-handlers.fixtures');
const { buildRows } = await import('../../src/views/GameStore/behavior/build-rows');
const { cardPropsOf } = await import('../../src/views/GameStore/behavior/card-props');
const { filterRows } = await import('../../src/views/GameStore/behavior/filter-rows');
const { readyNotice } = await import('../../src/views/GameStore/behavior/ready-notice');
const { trustConsent } = await import('../../src/views/GameStore/behavior/trust-consent');

const handlers = fixtureHandlers([]);

const found = (apworld: string, stars: number, patch: Partial<NonNullable<CatalogEntry['discovered']>> = {}): CatalogEntry => ({
  apworld, game: apworld, displayName: apworld, tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '1.0.0', url: `https://x/${apworld}.apworld`, sha256: 'a'.repeat(64) }],
  firstParty: { repo: `owner/${apworld}`, bundleUrl: 'https://x/bundle' },
  discovered: { repoId: stars + 100, repo: `owner/${apworld}`, owner: 'owner', stars, pushedAt: `2026-10-0${Math.max(1, Math.min(9, stars))}T00:00:00Z`, createdAt: '', direct: false, ...patch },
});

const listed = (apworld: string): CatalogEntry => ({
  apworld, game: apworld, displayName: apworld, tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '1.0.0', url: 'https://x/w.apworld' }], firstParty: { client: 'c', repo: 'o/r', bundleUrl: 'https://x/b' },
});

const request: InstallRequest = { kind: 'index', apworld: 'star', version: '1.0.0' };

beforeEach(() => confirmAction.mockReset());

describe('worlds found by their topic in the store', () => {
  test('the card is not Verified and says it was not reviewed, with the repository named in its kind', () => {
    const card = cardPropsOf(rowOf(found('star', 3)), handlers);
    expect(card.verified).toBe(false);
    expect(card.notes).toContainEqual(expect.objectContaining({ text: 'Not reviewed by Archipelia', warning: true }));
    expect(card.kindLabel).toContain('not reviewed');
  });

  test('a world that is also in the Archipelago index says so', () => {
    const card = cardPropsOf(rowOf(found('star', 3, { alsoInIndex: true })), handlers);
    expect(card.notes).toContainEqual(expect.objectContaining({ text: 'Also in the Archipelago index' }));
  });

  test('once installed the install record speaks for it, so the note is not said twice', () => {
    const installed = { apworld: 'star', game: 'star', version: '1.0.0', source: 'first-party', installedAt: 0, trust: { state: 'unverified', detail: 'Not reviewed: owner/star' } } as InstalledGame;
    const { notes } = cardPropsOf(rowOf(found('star', 3), [installed]), handlers);
    expect(notes.map((note) => note.text)).toEqual(['Not reviewed: owner/star']);
  });

  test('a listed world is Verified and has no review note', () => {
    const card = cardPropsOf(rowOf(listed('relic')), handlers);
    expect(card.verified).toBe(true);
    expect(card.notes).toEqual([]);
  });

  test('Verified first, then stars, then the newest push, then the name', () => {
    const rows = buildRows([found('zed', 2), found('few', 1), listed('relic'), found('many', 9), found('same', 2, { pushedAt: '2026-10-09T00:00:00Z' })], []);
    expect(filterRows(rows, '', []).map((row) => row.entry.apworld)).toEqual(['relic', 'many', 'same', 'zed', 'few']);
  });

  test('the Verified filter keeps listed worlds and the other value keeps the rest', () => {
    const rows = buildRows([listed('relic'), found('star', 3)], []);
    const only = (value: string) => filterRows(rows, '', [{ id: 'v', path: 'verified', op: 'anyOf', value: [value], enabled: true }]).map((row) => row.entry.apworld);
    expect(only('Verified')).toEqual(['relic']);
    expect(only('Not verified')).toEqual(['star']);
  });

  test('a search by the repository or its owner finds the world', () => {
    const rows = buildRows([found('star', 3, { owner: 'maker', repo: 'maker/star-hub' }), listed('relic')], []);
    expect(filterRows(rows, 'star-hub', []).map((row) => row.entry.apworld)).toEqual(['star']);
  });

  test('says how many were shown when the search had more', () => {
    expect(readyNotice(undefined)).toBeUndefined();
    expect(readyNotice({ total: 742, shown: 500 })).toBe('Showing the 500 most recently updated of 742 Archipelia ready worlds.');
  });
});

describe('the question before a world that Archipelia has not reviewed', () => {
  test('names the repository and its owner, and passes the repository id when accepted', async () => {
    confirmAction.mockResolvedValue(true);
    const row = rowOf(found('star', 3, { repoId: 77 }));
    expect(await trustConsent(row, request)).toEqual({ ...request, acceptRepoId: 77 });
    expect(confirmAction).toHaveBeenCalledOnce();
    const [asked] = confirmAction.mock.calls[0] as [{ facts: { label: string; value: string }[] }];
    expect(asked.facts).toEqual(expect.arrayContaining([{ label: 'Repository', value: 'owner/star' }, { label: 'Published by', value: 'owner' }]));
  });

  test('cancelling installs nothing', async () => {
    confirmAction.mockResolvedValue(false);
    expect(await trustConsent(rowOf(found('star', 3)), request)).toBeUndefined();
  });

  test('is not asked again for an update from the repository already accepted', async () => {
    const installed = { apworld: 'star', game: 'star', version: '0.9.0', source: 'first-party', installedAt: 0, origin: { repoId: 103, repo: 'owner/star' } } as InstalledGame;
    expect(await trustConsent(rowOf(found('star', 3), [installed]), request)).toBe(request);
    expect(confirmAction).not.toHaveBeenCalled();
  });

  test('asks again when the installed world came from another repository', async () => {
    confirmAction.mockResolvedValue(true);
    const installed = { apworld: 'star', game: 'star', version: '0.9.0', source: 'first-party', installedAt: 0, origin: { repoId: 5, repo: 'old/star' } } as InstalledGame;
    await trustConsent(rowOf(found('star', 3), [installed]), request);
    expect(confirmAction).toHaveBeenCalledOnce();
  });

  test('is not asked for a listed world or a built-in one', async () => {
    expect(await trustConsent(rowOf(listed('relic')), request)).toBe(request);
    expect(await trustConsent(undefined, request)).toBe(request);
    expect(confirmAction).not.toHaveBeenCalled();
  });
});
