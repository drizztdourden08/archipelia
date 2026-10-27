/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { buildRun, runOverridesOf, runPlayersOf } from '../src';
import { preset, template } from './old-records';

const SAVED = template();

const CAROL = preset(3, 'Carol', 'Celeste');

const used = (patch: Parameters<typeof template>[0]) => template(patch);

describe('the overrides of a run', () => {
  test('are empty when the run used the saved values', () => {
    expect(runOverridesOf(SAVED, template())).toEqual([]);
  });

  test('list each setup value that differs, with the saved and the used value', () => {
    const changed = used({ server: { ...SAVED.server, hintCost: 5 }, generator: { ...SAVED.generator, race: true }, lan: true });
    expect(runOverridesOf(SAVED, changed)).toEqual([
      { field: 'lan', label: 'Open to the LAN', from: 'off', to: 'on' },
      { field: 'server.hintCost', label: 'Hint cost', from: '10', to: '5' },
      { field: 'generator.race', label: 'Race mode', from: 'off', to: 'on' },
    ]);
  });

  test('say where and how clients connect', () => {
    const changed = used({ host: { kind: 'archipelago-gg' }, direct: { admission: 'open', allowUnlisted: true } });
    expect(runOverridesOf(SAVED, changed).map(({ field, from, to }) => [field, from, to])).toEqual([
      ['host', 'local :38281', 'archipelago.gg'],
      ['direct.admission', 'off', 'open'],
      ['direct.allowUnlisted', 'off', 'on'],
    ]);
  });

  test('never print the password, only whether one is set', () => {
    const changed = used({ server: { ...SAVED.server, passwordRef: 'room-password-sunday' } });
    expect(runOverridesOf(SAVED, changed)).toEqual([{ field: 'server.password', label: 'Room password', from: 'none', to: 'set' }]);
  });

  test('show a player added, removed or changed in the lobby', () => {
    const drizzt = preset(1, 'Drizzt', 'Hollow Knight');
    const alice = preset(2, 'Alice', 'Celeste');
    const changedAlice = { ...alice, source: { kind: 'preset' as const, presetId: 'easy', overrides: { crystals: 7 } } };
    const overrides = runOverridesOf(SAVED, used({ players: [drizzt, changedAlice, CAROL] }));
    expect(overrides).toEqual([
      { field: 'players.Alice', label: 'Player Alice', from: 'Celeste, preset easy (crystals=5)', to: 'Celeste, preset easy (crystals=7)' },
      { field: 'players.Carol', label: 'Player Carol', from: '', to: 'Celeste, preset easy (crystals=5)' },
    ]);
    expect(runOverridesOf(SAVED, used({ players: [drizzt] }))).toEqual([
      { field: 'players.Alice', label: 'Player Alice', from: 'Celeste, preset easy (crystals=5)', to: '' },
    ]);
  });

  test('notice an imported file that changed under the same name', () => {
    const yaml = (text: string) => template({ players: [{ slot: 1, name: 'Bob', game: 'Celeste', source: { kind: 'yaml', fileName: 'bob.yaml', yaml: text } }] });
    expect(runOverridesOf(yaml('game: Celeste'), yaml('game: Celestf'))).toHaveLength(1);
    expect(runOverridesOf(yaml('game: Celeste'), yaml('game: Celeste'))).toEqual([]);
  });
});

describe('the players of a run', () => {
  const saved = template({ players: [...SAVED.players, { ...preset(3, 'Bob', 'Celeste'), direct: true }] });
  const client = { slot: 3, name: 'Bob', game: 'Celeste', member: { displayName: "Bob's PC", client: 'Archipelia 1.0', trust: 'verified' as const } };

  test('are saved when the setup had them, added when the lobby brought them', () => {
    const players = runPlayersOf({ saved, hosted: [...SAVED.players, { ...CAROL, slot: 4 }] });
    expect(players.map(({ name, origin }) => [name, origin])).toEqual([['Drizzt', 'saved'], ['Alice', 'saved'], ['Carol', 'added']]);
  });

  test('are joined when a client took the seat, with who joined and how far it is trusted', () => {
    const players = runPlayersOf({ saved, hosted: SAVED.players, joined: [client] });
    expect(players).toHaveLength(3);
    expect(players[2]).toEqual({ ...client, origin: 'joined' });
  });

  test('a seat the host also set up goes to the client who joined it', () => {
    const players = runPlayersOf({ saved, hosted: [...SAVED.players, { ...preset(3, 'Bob', 'Celeste'), direct: true }], joined: [client] });
    expect(players.filter((player) => player.slot === 3)).toEqual([{ ...client, origin: 'joined' }]);
  });
});

describe('a run built from a saved session', () => {
  test('records the source, the overrides, the config that ran and the players', () => {
    const config = used({ server: { ...SAVED.server, hintCost: 5 } });
    const players = runPlayersOf({ saved: SAVED, hosted: config.players });
    const run = buildRun({ id: 'run2', createdAt: 5, saved: SAVED, used: config, players });
    expect(run).toEqual({
      id: 'run2', templateId: 'sunday', snapshot: config, status: 'generating', createdAt: 5, players,
      source: { sessionId: 'sunday', sessionName: 'Sunday run', match: 'recorded', overrides: [{ field: 'server.hintCost', label: 'Hint cost', from: '10', to: '5' }] },
    });
  });
});
