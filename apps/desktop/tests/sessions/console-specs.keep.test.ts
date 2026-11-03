/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleSpecsOf } from '../../src/views/SessionDashboard/behavior/console-specs-of';

const specs = consoleSpecsOf(['Ana', 'Bo']);
const specOf = (id: string) => specs.find((spec) => spec.id === id);

describe('K2 console command specs', { tags: ['critical'] }, () => {
  test('every command becomes a pattern spec with a fixed command word and one slot per param', () => {
    expect(specOf('hint')?.pattern).toBe('/hint {player:choice @players} {item:choice @items}');
    expect(specOf('send_multiple')?.pattern).toBe('/send_multiple {amount:number 1..100} {player:choice @players} {item:choice @items}');
    expect(specOf('players')?.pattern).toBe('/players');
  });

  test('player slots list the room players and the option slot lists the server options', () => {
    const spec = specOf('release');
    const lists = spec?.setup?.lists;
    expect(lists?.players).toEqual([{ value: 'Ana' }, { value: 'Bo' }]);
    expect(lists?.options).toContainEqual({ value: 'hint_cost' });
  });

  test('an optional param is an optional slot and each catalog command is exactly one spec', () => {
    expect(specOf('countdown')?.pattern).toBe('/countdown {seconds:number? 1..3600}');
    expect(specOf('status')?.pattern).toBe('/status {tag:text?}');
    expect(specs.length).toBe(consoleCommands.length);
    expect(specs.map((spec) => spec.id)).toEqual(consoleCommands.map((command) => command.id));
  });

  test('the command line still comes from the catalog format', () => {
    expect(specOf('hint')?.format?.({ player: 'Ana', item: 'Moon Pearl' })).toBe('/hint Ana "Moon Pearl"');
    expect(specOf('status')?.format?.({})).toBe('/status');
  });
});
