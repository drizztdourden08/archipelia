/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleSpecsOf } from '../../src/views/SessionDashboard/behavior/console-specs-of';

const specs = consoleSpecsOf(['Ana', 'Bo']);
const specOf = (id: string) => specs.find((spec) => spec.id === id);
const hasSpec = (commandId: string) => specs.some((spec) => spec.id.startsWith(commandId));

describe('K2 console command specs', { tags: ['critical'] }, () => {
  test('every command becomes a pattern spec with a fixed command word and one slot per param', () => {
    expect(specOf('hint')?.pattern).toBe('/hint {player:choice @players} {item:text}');
    expect(specOf('send_multiple')?.pattern).toBe('/send_multiple {amount:number 1..100} {player:choice @players} {item:text}');
    expect(specOf('players')?.pattern).toBe('/players');
    expect(consoleCommands.every((command) => hasSpec(command.id))).toBe(true);
  });

  test('player slots list the room players and the option slot lists the server options', () => {
    const spec = specOf('release');
    const lists = spec !== undefined && 'setup' in spec ? spec.setup?.lists : undefined;
    expect(lists?.players).toEqual([{ value: 'Ana' }, { value: 'Bo' }]);
    expect(lists?.options).toContainEqual({ value: 'hint_cost' });
  });

  test('a command with an optional param also gets a short spec without it', () => {
    expect(specOf('countdown')?.pattern).toBe('/countdown {seconds:number 1..3600}');
    expect(specOf('countdown-short')?.pattern).toBe('/countdown');
    expect(specOf('countdown-short')?.label).toBe('Countdown (no seconds)');
  });

  test('the command line still comes from the catalog format', () => {
    expect(specOf('hint')?.format?.({ player: 'Ana', item: 'Moon Pearl' })).toBe('/hint Ana "Moon Pearl"');
    expect(specOf('status-short')?.format?.({})).toBe('/status');
  });
});
