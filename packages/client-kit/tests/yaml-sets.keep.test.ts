/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parse } from 'yaml';
import { buildPlayerYaml, parseOptionSchema, validateOptions } from '../src';
import { failureOf } from './helpers/failure-of';

const TRICKS = ['Hammer: Jump', 'Say "hi"', 'Plain Trick', 'yes'];

const setSchema = parseOptionSchema([
  { key: 'tricks_in_logic', type: 'set', names: TRICKS, default: [] },
  { key: 'route', type: 'list', names: TRICKS, default: ['Plain Trick'] },
]);

describe('K1 set and list rows', { tags: ['standard'] }, () => {
  test('a set row is parsed with its names and default', () => {
    expect(setSchema[0]).toEqual({ key: 'tricks_in_logic', type: 'set', names: TRICKS, default: [] });
    expect(setSchema[1]?.type).toBe('list');
  });

  test('a bad default, a missing names list and a repeated name are refused', () => {
    expect(failureOf(() => parseOptionSchema([{ key: 'a', type: 'set', names: ['x'], default: ['y'] }])).message)
      .toContain('default of a: "y" is not one of: x.');
    expect(failureOf(() => parseOptionSchema([{ key: 'a', type: 'set', names: ['x'], default: ['x', 'x'] }])).message)
      .toContain('listed twice');
    expect(failureOf(() => parseOptionSchema([{ key: 'a', type: 'list' }])).message).toContain('a set or list needs');
    expect(failureOf(() => parseOptionSchema([{ key: 'a', type: 'set', names: ['x', 'x'] }])).message).toContain('"names" lists a name twice');
  });

  test('a value outside the names, a repeat in a set and a non-list are refused', () => {
    const run = (values: Record<string, unknown>) => validateOptions({ schema: setSchema, values });
    expect(run({ tricks_in_logic: ['nope'] })).toMatchObject({ ok: false, issues: [{ key: 'tricks_in_logic', code: 'bad-choice' }] });
    expect(run({ tricks_in_logic: ['yes', 'yes'] })).toMatchObject({ ok: false, issues: [{ code: 'duplicate-value' }] });
    expect(run({ tricks_in_logic: 'yes' })).toMatchObject({ ok: false, issues: [{ code: 'wrong-type' }] });
    expect(run({ tricks_in_logic: 'random' })).toMatchObject({ ok: false });
    expect(run({ route: ['yes', 'yes'] })).toEqual({ ok: true, values: { route: ['yes', 'yes'] } });
  });

  test('names that need quoting are written quoted and read back unchanged', () => {
    const picked = ['Hammer: Jump', 'Say "hi"', 'yes', 'Plain Trick'];
    const text = buildPlayerYaml({ game: 'G', slotName: 'S', schema: setSchema, options: { tricks_in_logic: picked } });
    expect(text).toBe([
      'name: S',
      'game: G',
      'G:',
      '  tricks_in_logic:',
      '    - "Hammer: Jump"',
      '    - "Say \\"hi\\""',
      '    - "yes"',
      '    - Plain Trick',
      '',
    ].join('\n'));
    for (const version of ['1.1', '1.2'] as const) {
      expect(parse(text, { version })).toEqual({ name: 'S', game: 'G', G: { tricks_in_logic: picked } });
    }
  });

  test('an empty set is written as []', () => {
    const text = buildPlayerYaml({ game: 'G', slotName: 'S', schema: setSchema, options: { tricks_in_logic: [] } });
    expect(text).toBe(['name: S', 'game: G', 'G:', '  tricks_in_logic: []', ''].join('\n'));
  });
});
