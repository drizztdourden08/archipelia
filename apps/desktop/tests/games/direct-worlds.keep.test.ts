/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { joinsDirectly } from '@archipelia/model';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { handlers as fixtureHandlers, rowFor } from './game-handlers.fixtures';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { filterRows } from '../../src/views/GameStore/behavior/filter-rows';
import { directWorldsOf } from '../../src/views/SessionBuilder/behavior/direct-worlds';
import { mayJoinDirectly } from '../../src/views/SessionBuilder/behavior/may-join-directly';
import { worldsWarning } from '../../src/views/SessionBuilder/behavior/worlds-warning';
import { presetPlayer } from '../sessions/session-fixtures';

const handlers = fixtureHandlers([]);

const found = (apworld: string, direct: boolean): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '1.0.0', url: `https://x/${apworld}.apworld`, sha256: 'a'.repeat(64) }],
  firstParty: { repo: `owner/${apworld}`, bundleUrl: 'https://x/bundle' },
  discovered: { repoId: 1, repo: `owner/${apworld}`, owner: 'owner', stars: 1, pushedAt: '', createdAt: '', direct },
});

const listed = (apworld: string): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '1.0.0', url: 'https://x/w.apworld' }], firstParty: { client: 'c', repo: 'o/r', bundleUrl: 'https://x/b' },
});

const index = (apworld: string): CatalogEntry => ({
  apworld, game: apworld.toUpperCase(), displayName: apworld, tags: [], source: 'index', stability: 'unknown', versions: [{ version: '1.0.0', url: 'https://x/i.apworld' }],
});

const world = (apworld: string): InstalledGame => ({ apworld, game: apworld.toUpperCase(), version: '1.0.0', source: 'first-party', installedAt: 0 }) as InstalledGame;

describe('worlds that join directly', () => {
  test('a registry world with a client and a topic world marked direct join directly; the rest do not', () => {
    expect(joinsDirectly(listed('relic'))).toBe(true);
    expect(joinsDirectly(found('star', true))).toBe(true);
    expect(joinsDirectly(found('moon', false))).toBe(false);
    expect(joinsDirectly(index('plain'))).toBe(false);
  });

  test('the card and the dialog carry the flag, and an unlisted direct world says the host must allow unlisted clients', () => {
    expect(cardPropsOf(rowFor(listed('relic')), handlers)).toMatchObject({ verified: true, direct: true });
    const card = cardPropsOf(rowFor(found('star', true)), handlers);
    expect(card).toMatchObject({ verified: false, direct: true });
    expect(card.notes).toContainEqual(expect.objectContaining({ text: 'Joins as an unlisted client: the host must allow unlisted clients' }));
    const plain = cardPropsOf(rowFor(found('moon', false)), handlers);
    expect(plain.direct).toBe(false);
    expect(plain.notes.map((note) => note.text)).not.toContain('Joins as an unlisted client: the host must allow unlisted clients');
  });

  test('the Joins directly filter keeps direct worlds and the other value keeps the rest, and a search for the words finds them', () => {
    const rows = buildRows([listed('relic'), found('star', true), found('moon', false), index('plain')], []);
    const only = (value: string) => filterRows(rows, '', [{ id: 'd', path: 'direct', op: 'anyOf', value: [value], enabled: true }]).map((row) => row.entry.apworld).sort();
    expect(only('Joins directly')).toEqual(['relic', 'star']);
    expect(only('Does not join directly')).toEqual(['moon', 'plain']);
    expect(filterRows(rows, 'joins directly', []).map((row) => row.entry.apworld).sort()).toEqual(['relic', 'star']);
  });
});

describe('the setup page and worlds that join directly', () => {
  const players = [presetPlayer(1, 'Ana', 'p1', 'RELIC'), presetPlayer(2, 'Bo', 'p1', 'STAR'), presetPlayer(3, 'Cy', 'p1', 'PLAIN')];
  const entries = [listed('relic'), found('star', true), index('plain')];
  const installed = [world('relic'), world('star'), { ...world('plain'), source: 'index' } as InstalledGame];

  test('lists the games of the session that have a direct client, and marks the ones outside the registry', () => {
    expect(directWorldsOf(players, installed, entries)).toEqual([{ game: 'RELIC', listed: true }, { game: 'STAR', listed: false }]);
    expect(directWorldsOf([], installed, entries)).toEqual([]);
  });

  test('asks for the catalog only when an installed ready world is in the session', () => {
    expect(mayJoinDirectly(players, installed)).toBe(true);
    expect(mayJoinDirectly([presetPlayer(3, 'Cy', 'p1', 'PLAIN')], installed)).toBe(false);
  });

  test('warns that a world outside the registry needs Allow unlisted clients, and only while it is off', () => {
    const worlds = directWorldsOf(players, installed, entries);
    expect(worldsWarning(worlds, false)).toContain('Allow unlisted clients');
    expect(worldsWarning(worlds, true)).toBeNull();
    expect(worldsWarning([{ game: 'RELIC', listed: true }], false)).toBeNull();
  });
});
