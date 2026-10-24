/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parse } from 'yaml';
import { buildPlayerYaml, emitYaml, isKitError, parseOptionSchema, validateOptions } from '../src';
import type { PlayerYamlInput } from '../src';
import { ROTP_GAME } from './helpers/rotp-world.constants';
import { readFixture, readJsonFixture } from './helpers/read-fixture';

const schema = parseOptionSchema(readJsonFixture('rotp-options.json'));

const input: PlayerYamlInput = {
  game: ROTP_GAME,
  slotName: 'Link',
  description: 'Relic of the Past 0.22.0',
  schema,
  options: {
    progression_balancing: 50,
    accessibility: 'full',
    death_link: false,
    shop_shuffle: 'random',
    capacity_mode: '2',
    dungeon_count: 5,
    seed_text: 'seed: 1234',
  },
  preRolled: { pond: { demands: [1, 2, 3] }, shop: { prices: [], tag: 'random' } },
};

const failureOf = (run: () => unknown): { message: string; issues: { key: string; code: string }[] } => {
  try {
    run();
  } catch (error) {
    if (isKitError(error)) return { message: error.message, issues: [...error.issues] };
    throw error;
  }
  throw new Error('expected a failure');
};

describe('the player YAML builder', () => {
  test('writes the RotP shaped fixture exactly', () => {
    expect(buildPlayerYaml(input)).toBe(readFixture('rotp-player.yaml'));
  });

  test('the output reads back as the same data under YAML 1.1 and 1.2', () => {
    const text = buildPlayerYaml(input);
    for (const version of ['1.1', '1.2'] as const) {
      const doc = parse(text, { version }) as Record<string, unknown>;
      expect(doc.name).toBe('Link');
      expect(doc.game).toBe(ROTP_GAME);
      const block = doc[ROTP_GAME] as Record<string, unknown>;
      expect(block.shop_shuffle).toBe(2);
      expect(block.capacity_mode).toBe(2);
      expect(block.death_link).toBe(false);
      expect(block.seed_text).toBe('seed: 1234');
      expect(block.pre_rolled).toEqual({ pond: { demands: [1, 2, 3] }, shop: { prices: [], tag: 'random' } });
    }
  });

  test('works without a schema and keeps the caller order', () => {
    const text = buildPlayerYaml({ game: 'Other Game', slotName: 'Zed', options: { b: 1, a: true } });
    expect(text).toBe('name: Zed\ngame: Other Game\nOther Game:\n  b: 1\n  a: true\n');
  });

  test('withDefaults fills the rows the caller left out', () => {
    const text = buildPlayerYaml({ game: ROTP_GAME, slotName: 'Link', schema, options: { dungeon_count: 3 }, withDefaults: true });
    const block = (parse(text) as Record<string, Record<string, unknown>>)[ROTP_GAME] ?? {};
    expect(block.dungeon_count).toBe(3);
    expect(block.progression_balancing).toBe(50);
    expect(block.accessibility).toBe('full');
  });

  test('common Archipelago options pass without a schema row', () => {
    const text = buildPlayerYaml({ game: ROTP_GAME, slotName: 'Link', schema, options: { local_items: ['Sword'], start_hints: [] } });
    expect(text).toContain('local_items:\n    - Sword');
    expect(text).toContain('start_hints: []');
  });
});

describe('validation errors', () => {
  test('lists every problem with the option name', () => {
    const failure = failureOf(() => buildPlayerYaml({
      ...input,
      options: { death_link: 'yes', dungeon_count: 9, accessibility: 'sideways', mystery: 1, seed_text: 5, pre_rolled2: 1 },
    }));
    expect(failure.issues.map((issue) => `${issue.key}:${issue.code}`).sort()).toEqual([
      'accessibility:bad-choice',
      'death_link:wrong-type',
      'dungeon_count:out-of-range',
      'mystery:unknown-option',
      'pre_rolled2:unknown-option',
      'seed_text:wrong-type',
    ]);
    expect(failure.message).toContain('dungeon_count: 9 is outside 1 to 8.');
    expect(failure.message).toContain('accessibility: "sideways" is not one of: full, minimal.');
    expect(failure.message).toContain('death_link: expected true or false, got "yes".');
    expect(failure.message).toContain('mystery: this world has no such option.');
  });

  test('a fractional range value is refused', () => {
    const result = validateOptions({ schema, values: { dungeon_count: 2.5 } });
    expect(result.ok).toBe(false);
  });

  test('random is refused unless allowed, and a choice with its own random keeps it as its id', () => {
    const refused = validateOptions({ schema, values: { death_link: 'random' } });
    expect(refused.ok).toBe(false);
    const allowed = validateOptions({ schema, values: { death_link: 'random' }, allowRoll: true });
    expect(allowed).toEqual({ ok: true, values: { death_link: 'random' } });
    const own = validateOptions({ schema, values: { shop_shuffle: 'Random' } });
    expect(own).toEqual({ ok: true, values: { shop_shuffle: 2 } });
  });

  test('allowUnknown lets other rows through', () => {
    expect(validateOptions({ schema, values: { extra: 1 }, allowUnknown: true })).toEqual({ ok: true, values: { extra: 1 } });
  });
});

describe('validation of the other inputs', () => {
  test.each([
    ['', 'non-empty'],
    [' Link', 'start or end with a space'],
    ['A name over sixteen', 'longer than 16'],
    ['Li{nk}', 'control characters'],
    ['Li\nnk', 'control characters'],
  ])('slot name %j is refused', (slotName, part) => {
    const failure = failureOf(() => buildPlayerYaml({ game: ROTP_GAME, slotName }));
    expect(failure.message).toContain(part);
    expect(failure.issues[0]?.code).toBe('bad-slot-name');
  });

  test('a game that collides with a top level key is refused', () => {
    expect(failureOf(() => buildPlayerYaml({ game: 'name', slotName: 'Link' })).issues[0]?.code).toBe('bad-game');
  });

  test('preRolled given twice is refused', () => {
    const failure = failureOf(() => buildPlayerYaml({ ...input, options: { pre_rolled: {} } }));
    expect(failure.issues.map((issue) => issue.code)).toContain('duplicate-value');
  });

  test('values the writer cannot express are refused', () => {
    expect(failureOf(() => buildPlayerYaml({ game: 'G', slotName: 'S', options: { a: Number.NaN } })).message).toContain('NaN');
    expect(failureOf(() => buildPlayerYaml({ game: 'G', slotName: 'S', options: { a: 1n } })).message).toContain('bigint');
    expect(failureOf(() => buildPlayerYaml({ game: 'G', slotName: 'S', options: { a: new Date(0) } })).message).toContain('object');
    expect(failureOf(() => buildPlayerYaml({ game: 'G', slotName: 'S', options: { a: '\ud800' } })).message).toContain('Unicode');
  });

  test('a bad schema is explained', () => {
    expect(failureOf(() => parseOptionSchema([{ key: 'a', type: 'choice' }, { type: 'toggle' }, { key: 'a', type: 'range' }])).message)
      .toContain('a: a choice needs');
    expect(failureOf(() => parseOptionSchema('{')).message).toContain('not JSON');
    expect(failureOf(() => parseOptionSchema({})).message).toContain('list of option rows');
  });
});

const NASTY = [
  '', ' ', 'a ', ' a', 'true', 'No', 'null', '~', '123', '1e3', '0x1F', '.inf', '.nan', '...', '---', '- x', 'a: b', 'a #b', '#c',
  '"q"', "it's", 'back\\slash', 'line\nbreak', 'tab\t', 'cr\r', '\u0085', ' ', '\u0000', '\u007f', '﻿', 'café',
  '\u{1F600}', '{a}', '[a]', '*alias', '&anchor', '!tag', '@x', '`x', '%d', '|', '>', '?', 'a,b', '1_000', '2001-12-14', '1:30',
  'y', 'n', 'random', '<<', '=', 'on', 'Off', 'plain words here', 'path/to.file (1)',
];

describe('the emitter is safe', () => {
  test.each(NASTY.map((value) => [JSON.stringify(value), value]))('the text %s reads back unchanged as a value and as a key', (_label, value) => {
    const text = emitYaml({ key: value, list: [value], nested: { [value]: value } });
    for (const version of ['1.1', '1.2'] as const) {
      expect(parse(text, { version })).toEqual({ key: value, list: [value], nested: { [value]: value } });
    }
  });

  test('numbers, booleans, null, empty containers and nesting', () => {
    const value = { n: -3, f: 0.5, t: true, z: null, e: [], o: {}, deep: [{ a: [1, [2, 3]], b: { c: [] } }, 'x'] };
    expect(parse(emitYaml(value))).toEqual(value);
  });

  test('undefined object values are left out', () => {
    expect(emitYaml({ a: 1, b: undefined })).toBe('a: 1\n');
  });

  test('a prototype key stays a plain key', () => {
    const text = emitYaml(JSON.parse('{"__proto__": {"x": 1}}'));
    expect(text).toBe('__proto__:\n  x: 1\n');
  });

  test('a structure nested too deep is refused', () => {
    let value: unknown = 1;
    for (let level = 0; level < 100; level += 1) value = { next: value };
    expect(failureOf(() => emitYaml(value)).message).toContain('nested deeper');
  });
});
