/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionTemplate } from '@archipelia/model';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { validateTemplate } from '../../src/views/SessionBuilder/behavior/template-validation';
import { PORT_PROBLEM } from '@archipelia/design';
import { GAME, PRESET, presetPlayer } from './session-fixtures';

const LIBRARY = { installed: [GAME], presets: [PRESET] };

const withPlayers = (players: SessionTemplate['players']): SessionTemplate => ({ ...newTemplate('t1'), name: 'Friday', players });

describe('session validation', () => {
  test('a named session with one valid player has no problem', () => {
    expect(validateTemplate(withPlayers([presetPlayer(1, 'Johnny')]), LIBRARY)).toEqual([]);
  });

  test('it needs a name and at least one player', () => {
    expect(validateTemplate({ ...newTemplate('t1'), name: ' ' }, LIBRARY)).toEqual(['The session needs a name', 'Add at least one player']);
  });

  test('player names must be unique, ignoring case, and short enough', () => {
    const problems = validateTemplate(withPlayers([
      presetPlayer(1, 'Johnny'), presetPlayer(2, 'johnny'), presetPlayer(3, ''), presetPlayer(4, 'ABCDEFGHIJKLMNOPQ'),
    ]), LIBRARY);
    expect(problems).toContain('Two players are named johnny');
    expect(problems).toContain('Player 3 needs a name');
    expect(problems).toContain('ABCDEFGHIJKLMNOPQ: a name holds at most 16 characters');
  });

  test('a preset player needs an installed game and a preset of that game', () => {
    const problems = validateTemplate(withPlayers([
      presetPlayer(1, 'A', 'p1', 'Missing'), presetPlayer(2, 'B', 'nope'), presetPlayer(3, 'C', '', ''),
    ]), LIBRARY);
    expect(problems).toEqual(['A: Missing is not installed', 'B: pick a preset', 'C: pick a game']);
  });

  test('overrides that break an option are reported', () => {
    const player = { ...presetPlayer(1, 'A'), source: { kind: 'preset' as const, presetId: 'p1', overrides: { crystals: 12 } } };
    expect(validateTemplate(withPlayers([player]), LIBRARY)).toEqual(['A: crystals must be between 0 and 7']);
  });

  test('an imported player needs a file and an installed game', () => {
    const empty = { slot: 1, name: 'A', game: 'Demo', source: { kind: 'yaml' as const, fileName: '', yaml: '' } };
    const other = { slot: 2, name: 'B', game: 'Other', source: { kind: 'yaml' as const, fileName: 'b.yaml', yaml: 'game: Other' } };
    expect(validateTemplate(withPlayers([empty, other]), LIBRARY)).toEqual(['A: import a player file', 'B: Other is not installed']);
  });

  test('a remote host needs a server and a local port must be valid', () => {
    const remote = { ...withPlayers([presetPlayer(1, 'A')]), host: { kind: 'remote' as const, serverId: '' } };
    const local = { ...withPlayers([presetPlayer(1, 'A')]), host: { kind: 'local' as const, port: 70000 } };
    expect(validateTemplate(remote, LIBRARY)).toEqual(['Pick a server to host on']);
    expect(validateTemplate(local, LIBRARY)).toEqual([PORT_PROBLEM]);
    expect(validateTemplate({ ...local, host: { kind: 'local' as const, port: 80 } }, LIBRARY)).toEqual([PORT_PROBLEM]);
    expect(validateTemplate({ ...local, host: { kind: 'local' as const, port: 1024 } }, LIBRARY)).toEqual([]);
  });
});
