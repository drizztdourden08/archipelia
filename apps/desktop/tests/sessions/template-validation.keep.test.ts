/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { InstalledGame, SessionTemplate } from '@archipelia/model';
import { templateOf } from '@archipelia/model';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { setupProblems } from '../../src/views/SessionBuilder/behavior/setup-problems';
import { validatePlayers } from '../../src/views/SessionLobby/behavior/validate-players';
import { PORT_PROBLEM } from '@archipelia/design';
import { GAME, PRESET, presetPlayer } from './session-fixtures';

const LIBRARY = { installed: [GAME], presets: [PRESET] };

const withPlayers = (players: SessionTemplate['players']): SessionTemplate => ({ ...newTemplate('t1'), name: 'Friday', players });

const brokenCrystals = () => ({ ...presetPlayer(1, 'A'), source: { kind: 'preset' as const, presetId: 'p1', overrides: { crystals: 12 } } });

const DIRECT = { admission: 'host-approval', allowUnlisted: false } as const;

describe('the setup of a session', () => {
  test('a named session with no player is ready to start', () => {
    expect(setupProblems(withPlayers([]))).toEqual([]);
  });

  test('it needs a name', () => {
    expect(setupProblems({ ...newTemplate('t1'), name: ' ' })).toEqual(['The session needs a name.']);
  });

  test('a remote host needs a server and a local port must be valid', () => {
    expect(setupProblems({ ...withPlayers([]), host: { kind: 'remote', serverId: '' } })).toEqual(['Pick a server to host on.']);
    expect(setupProblems({ ...withPlayers([]), host: { kind: 'local', port: 70000 } })).toEqual([PORT_PROBLEM]);
    expect(setupProblems({ ...withPlayers([]), host: { kind: 'local', port: 80 } })).toEqual([PORT_PROBLEM]);
    expect(setupProblems({ ...withPlayers([]), host: { kind: 'local', port: 1024 } })).toEqual([]);
  });

  test('direct connections need Local, LAN or an Archipelia server', () => {
    const gg = { ...withPlayers([]), host: { kind: 'archipelago-gg' as const }, direct: DIRECT };
    expect(setupProblems(gg)).toEqual(['Direct connections need Local, LAN or an Archipelia server under Where.']);
    expect(setupProblems({ ...withPlayers([]), lan: true, direct: DIRECT })).toEqual([]);
    expect(setupProblems({ ...withPlayers([]), lobby: { serverId: 'r1' }, direct: DIRECT })).toEqual([]);
  });
});

describe('the players in the lobby', () => {
  test('one valid player has no problem', () => {
    expect(validatePlayers(withPlayers([presetPlayer(1, 'Johnny')]), LIBRARY)).toEqual([]);
  });

  test('player names must be unique, ignoring case, and short enough', () => {
    const problems = validatePlayers(withPlayers([
      presetPlayer(1, 'Johnny'), presetPlayer(2, 'johnny'), presetPlayer(3, ''), presetPlayer(4, 'ABCDEFGHIJKLMNOPQ'),
    ]), LIBRARY);
    expect(problems).toContainEqual({ slot: 2, field: 'name', message: 'Two players are named johnny' });
    expect(problems).toContainEqual({ slot: 3, field: 'name', message: 'Player 3 needs a name' });
    expect(problems).toContainEqual({ slot: 4, field: 'name', message: 'ABCDEFGHIJKLMNOPQ: a name holds at most 16 characters' });
  });

  test('a preset player needs an installed game and a preset of that game', () => {
    const problems = validatePlayers(withPlayers([
      presetPlayer(1, 'A', 'p1', 'Missing'), presetPlayer(2, 'B', 'nope'), presetPlayer(3, 'C', '', ''),
    ]), LIBRARY);
    expect(problems).toEqual([
      { slot: 1, field: 'game', message: 'A: Missing is not installed' },
      { slot: 2, field: 'source', message: 'B: pick a preset' },
      { slot: 3, field: 'game', message: 'C: pick a game' },
    ]);
  });

  test('overrides that break an option are reported with the option key', () => {
    expect(validatePlayers(withPlayers([brokenCrystals()]), LIBRARY)).toEqual([
      { slot: 1, field: 'option', optionKey: 'crystals', optionLabel: 'crystals', message: 'A: crystals must be between 0 and 7' },
    ]);
  });

  test('a broken option is named by its display name', () => {
    const named: InstalledGame = {
      ...GAME,
      schema: { ...GAME.schema, options: GAME.schema.options.map((def) => (def.key === 'crystals' ? { ...def, displayName: 'Crystal count' } : def)) },
    };
    expect(validatePlayers(withPlayers([brokenCrystals()]), { installed: [named], presets: [PRESET] })).toEqual([
      { slot: 1, field: 'option', optionKey: 'crystals', optionLabel: 'Crystal count', message: 'A: Crystal count must be between 0 and 7' },
    ]);
  });

  test('an imported player needs a file and an installed game', () => {
    const empty = { slot: 1, name: 'A', game: 'Demo', source: { kind: 'yaml' as const, fileName: '', yaml: '' } };
    const other = { slot: 2, name: 'B', game: 'Other', source: { kind: 'yaml' as const, fileName: 'b.yaml', yaml: 'game: Other' } };
    expect(validatePlayers(withPlayers([empty, other]), LIBRARY)).toEqual([
      { slot: 1, field: 'source', message: 'A: import a player file' },
      { slot: 2, field: 'source', message: 'B: Other is not installed' },
    ]);
  });
});

describe('a session saved before the split', () => {
  test('keeps its players, which the lobby takes as its own players when it starts', () => {
    const stored = withPlayers([presetPlayer(1, 'Ana'), presetPlayer(2, 'Bo')]);
    expect(templateOf(stored)).toEqual(stored);
  });

  test('moves the lobby out of a direct connection and keeps the admission settings', () => {
    const legacy = { ...withPlayers([]), direct: { serverId: 'r1', lobbyId: 'lb_1', admission: 'open' as const, allowUnlisted: true } };
    expect(templateOf(legacy)).toMatchObject({ lobby: { serverId: 'r1', lobbyId: 'lb_1' }, direct: { admission: 'open', allowUnlisted: true } });
    expect(templateOf(legacy).direct).toEqual({ admission: 'open', allowUnlisted: true });
    const local = { ...withPlayers([]), direct: { serverId: 'local', admission: 'host-approval' as const, allowUnlisted: false } };
    expect(templateOf(local)).toMatchObject({ lobby: { serverId: 'local' }, direct: DIRECT });
  });
});
