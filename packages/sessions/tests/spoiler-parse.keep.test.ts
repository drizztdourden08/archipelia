/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { itemTypeOf, parseItemTypes, parseSpoiler } from '../src/spoiler';
import { ITEM_TYPES, MULTI, SINGLE, TYPED_SINGLE } from './spoiler-fixtures';

test('K1 a multiworld spoiler reads version, seed, global settings and each player with its game', { tags: ['critical'] }, () => {
  const log = parseSpoiler(MULTI);
  expect(log.version).toBe('0.6.7');
  expect(log.seed).toBe('16332343519413231238');
  expect(log.settings.map((setting) => setting.key)).toEqual(['Filling Algorithm', 'Players', 'Total Location Count', 'Plando Options']);
  expect(log.players.map((player) => [player.slot, player.name, player.game])).toEqual([
    [1, 'test slot', "Baldur's Gate 3"],
    [2, 'Player1', "Baldur's Gate 3"],
  ]);
  expect(log.players[0]?.options.find((option) => option.key === 'Goal')?.value).toBe('Rescue Halsin');
});

test('K2 multiworld placements split on the known player names even when names hold colons and brackets', { tags: ['critical'] }, () => {
  const { placements } = parseSpoiler(MULTI);
  expect(placements).toHaveLength(7);
  expect(placements[0]).toMatchObject({ location: 'Tut: Learn about the Helm', finder: 'test slot', item: 'Psychic spark', receiver: 'Player1' });
  expect(placements[1]).toMatchObject({ finder: 'test slot', receiver: 'test slot' });
  expect(placements[4]).toMatchObject({ location: 'Tut: Connect the Transponder', finder: 'Player1', receiver: 'test slot' });
});

test('K3 the playthrough sets the sphere and marks those placements required', { tags: ['critical'] }, () => {
  const log = parseSpoiler(MULTI);
  expect(log.spheres.map((sphere) => [sphere.index, sphere.placements.length])).toEqual([[0, 0], [1, 2], [2, 1], [3, 2]]);
  const reach = log.placements.find((placement) => placement.location === 'Tut: Reach the Helm');
  expect(reach).toMatchObject({ sphere: 1, required: true });
  const learn = log.placements.find((placement) => placement.location === 'Tut: Learn about the Helm');
  expect(learn).toMatchObject({ sphere: null, required: false });
  expect(log.placements).toHaveLength(7);
});

test('K4 entrances keep the player, both ends and the direction; other sections stay raw', { tags: ['critical'] }, () => {
  const log = parseSpoiler(MULTI);
  expect(log.entrances).toEqual([
    { player: 'test slot', entrance: 'Cave Door', exit: 'Cave Inside', direction: '=>' },
    { player: 'Player1', entrance: 'Front Gate', exit: 'Back Gate', direction: '<=>' },
  ]);
  expect(log.unreachable).toEqual(['Rope (test slot): Cliff (Player1)']);
  expect(log.sections).toEqual([{ title: 'Custom Notes', lines: ['  hello world'] }]);
  expect(log.unparsed).toEqual([]);
});

test('K5 a single player spoiler starts its player at Game, names it Player 1 or from known, and reads paths', { tags: ['critical'] }, () => {
  const log = parseSpoiler(SINGLE);
  expect(log.settings.map((setting) => setting.key)).toEqual(['Filling Algorithm', 'Players', 'Plando Options']);
  expect(log.players).toHaveLength(1);
  expect(log.players[0]).toMatchObject({ slot: 1, name: 'Player 1', game: 'Relic of the Past' });
  expect(log.players[0]?.options.find((option) => option.key === 'Cane of Somaria lights a dark room')?.value).toBe('Yes');
  expect(parseSpoiler(SINGLE, { players: ['Link'] }).players[0]?.name).toBe('Link');
  expect(log.paths).toEqual([
    { title: 'Agahnim 1 beaten', steps: ['region-001 -> Uncle S&Q', 'region-059 -> Hyrule Castle Secret Entrance Exit', 'region-176'] },
    { title: 'Ganon beaten', steps: ['region-001 -> Uncle S&Q'] },
  ]);
});

test('K6 a single player line keeps item names with brackets and joins finder and receiver to the slot', { tags: ['critical'] }, () => {
  const log = parseSpoiler(SINGLE, { players: ['Link'] });
  expect(log.placements[3]).toMatchObject({
    location: 'Hyrule Castle - Map Guard Key Drop',
    item: 'Small Key (Hyrule Castle)',
    finder: 'Link',
    receiver: 'Link',
  });
  expect(log.placements.find((placement) => placement.location === "Link's House")).toMatchObject({ sphere: 1, required: true });
});

test('K7 an ambiguous single player line resolves by the known locations, else by items seen elsewhere, else the first split', { tags: ['critical'] }, () => {
  const byItems = parseSpoiler(TYPED_SINGLE).placements;
  expect(byItems.map((placement) => placement.location)).toEqual(['Tut: Learn about the Helm', 'Tut: Reach the Helm', 'Chest: Key', 'Pot', 'Rock', 'Odd']);
  const byKnown = parseSpoiler(TYPED_SINGLE, { locations: ['Odd: Thing'] }).placements;
  expect(byKnown[5]).toMatchObject({ location: 'Odd: Thing', item: 'Mystery' });
});

test('K8 item types come from the sidecar flags, with required and unknown as the fallback', { tags: ['critical'] }, () => {
  const types = parseItemTypes(ITEM_TYPES);
  expect(types?.players).toEqual(['Hero']);
  const named = parseSpoiler(TYPED_SINGLE, { players: ['Hero'], locations: types?.locations ?? [] });
  expect(named.placements.map((placement) => itemTypeOf(placement, types))).toEqual(['filler', 'trap', 'progression', 'unknown', 'unknown', 'unknown']);
  const unnamed = parseSpoiler(TYPED_SINGLE, { locations: types?.locations ?? [] });
  expect(unnamed.placements.slice(0, 3).map((placement) => itemTypeOf(placement, types))).toEqual(['filler', 'trap', 'progression']);
  const plain = parseSpoiler(SINGLE);
  expect(plain.placements.map((placement) => itemTypeOf(placement, null))).toEqual(['unknown', 'unknown', 'required', 'required', 'unknown']);
  expect(parseItemTypes('not json')).toBeNull();
  expect(parseItemTypes(null)).toBeNull();
});
