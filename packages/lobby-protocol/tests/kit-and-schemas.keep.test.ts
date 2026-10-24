/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { CLIENT_SCHEMAS, SCHEMA_DEFS, SERVER_SCHEMAS, validateMessage, validateSchema } from '../src';
import { sha256Hex } from '../src/node';
import { createScenarioKit, makeApworld, makeYaml } from '../src/testing';
import { resolvePlaceholders } from '../src/testing/scenario/resolve-placeholders';
import { sampleOf } from '../src/testing/scenario/sample-of';
import { loadScenario } from '../src/testing';

const sampleHello = (): Record<string, unknown> => {
  const line = loadScenario('open-join').lines.find((candidate) => candidate.dir === 'c2s');
  if (line?.dir !== 'c2s' || !('msg' in line)) throw new Error('no hello');
  return resolvePlaceholders(line.msg, sampleOf) as Record<string, unknown>;
};

const setAt = (root: Record<string, unknown>, path: string[], value: unknown): void => {
  const last = path.at(-1);
  let node: Record<string, unknown> = root;
  for (const key of path.slice(0, -1)) node = node[key] as Record<string, unknown>;
  if (last === undefined) return;
  if (value === undefined) Reflect.deleteProperty(node, last);
  else node[last] = value;
};

describe('scenario kit', () => {
  const kit = createScenarioKit();
  const file = (name: string) => {
    const found = kit.files.find((candidate) => candidate.name === name);
    if (!found) throw new Error(`no kit file ${name}`);
    return found;
  };

  test('the RotP sizes of the spec example are kept', () => {
    expect(file('W').bytes.length).toBe(812345);
    expect(file('Y').bytes.length).toBe(4210);
    expect(kit.values.W_size).toBe(812345);
    expect(kit.values.Y_size).toBe(4210);
  });

  test('every value hash is the hash of its bytes', () => {
    for (const entry of kit.files) {
      expect(kit.values[entry.name]).toBe(sha256Hex(entry.bytes));
      expect(kit.values[`${entry.name}_size`]).toBe(entry.bytes.length);
    }
  });

  test('a world is a zip with its package folder and manifest', () => {
    const bytes = makeApworld({ module: 'demo_world', game: 'Demo', worldVersion: '1.2.3', minimumAp: '0.6.4', size: 5000 });
    expect(bytes.length).toBe(5000);
    expect(Buffer.from(bytes.subarray(0, 4)).toString('latin1')).toBe('PK\u0003\u0004');
    const end = Buffer.from(bytes.subarray(bytes.length - 22));
    expect(end.readUInt32LE(0)).toBe(0x06054b50);
    expect(end.readUInt16LE(10)).toBe(3);
    const text = Buffer.from(bytes).toString('latin1');
    expect(text).toContain('demo_world/archipelago.json');
    expect(text).toContain('"world_version":"1.2.3"');
  });

  test('a world too small for its own files is an error', () => {
    expect(() => makeApworld({ module: 'm', game: 'G', worldVersion: '1.0.0', size: 10 })).toThrow('cannot hold');
  });

  test('a YAML has the slot name and game and the exact size', () => {
    const bytes = makeYaml({ name: 'Link', game: 'Relic of the Past', size: 300 });
    const text = new TextDecoder().decode(bytes);
    expect(bytes.length).toBe(300);
    expect(text.startsWith('name: Link\ngame: Relic of the Past\n')).toBe(true);
    expect(makeYaml({ name: 'A', game: 'B', size: 60 }).length).toBe(60);
  });
});

describe('schemas', () => {
  test('a hello built from the fixture samples is valid', () => {
    expect(validateMessage('c2s', sampleHello())).toEqual([]);
  });

  const BREAKS: [string, string[], unknown][] = [
    ['client.version', ['client', 'version'], undefined],
    ['client.id', ['client', 'id'], 'X'],
    ['client.platform.os', ['client', 'platform', 'os'], 'ios'],
    ['lobby.code', ['lobby', 'code'], 'K7QM'],
    ['archipelago.version', ['archipelago', 'version'], '0.6'],
    ['archipelago.version', ['archipelago'], { min: '0.6.4', max: '0.6.8' }],
    ['player.displayName', ['player', 'displayName'], ''],
    ['slots', ['slots'], []],
    ['worlds[0].sha256', ['worlds', '0', 'sha256'], 'ABC'],
    ['worlds[0].proof', ['worlds', '0', 'proof'], { method: 'magic' }],
    ['protocol.versions', ['protocol', 'versions'], []],
    ['resume', ['resume'], 'short'],
  ];

  test.each(BREAKS)('a hello with a bad %s is refused and the field is named', (field, path, value) => {
    const hello = sampleHello();
    setAt(hello, path, value);
    expect(validateMessage('c2s', hello)[0]?.path).toBe(field);
  });

  test('nine slots are too many', () => {
    const hello = sampleHello() as { slots: unknown[] };
    hello.slots = Array.from({ length: 9 }, () => hello.slots[0]);
    expect(validateMessage('c2s', hello)[0]?.path).toBe('slots');
  });

  test('the validator supports the keywords the schemas use', () => {
    const schema = {
      $defs: { n: { type: 'integer', minimum: 2, maximum: 4 } },
      type: 'object',
      required: ['a'],
      properties: {
        a: { $ref: '#/$defs/n' },
        b: { type: ['string', 'null'], enum: ['x', null] },
        c: { type: 'array', minItems: 1, maxItems: 2, items: { const: 1 } },
        d: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      },
    };
    expect(validateSchema(schema, { a: 3, b: null, c: [1], d: 'text' })).toEqual([]);
    expect(validateSchema(schema, { a: 5 })[0]?.path).toBe('a');
    expect(validateSchema(schema, { a: 3, b: 'y' })[0]?.path).toBe('b');
    expect(validateSchema(schema, { a: 3, c: [] })[0]?.path).toBe('c');
    expect(validateSchema(schema, { a: 3, c: [2] })[0]?.path).toBe('c[0]');
    expect(validateSchema(schema, { a: 3, d: true })[0]?.path).toBe('d');
    expect(validateSchema(schema, {})[0]?.path).toBe('a');
  });

  test('unknown fields are ignored', () => {
    const hello = { ...sampleHello(), futureField: { anything: true } };
    expect(validateMessage('c2s', hello)).toEqual([]);
  });

  test('every schema is a draft 2020-12 document with an id and the shared definitions', () => {
    for (const schema of [...Object.values(CLIENT_SCHEMAS), ...Object.values(SERVER_SCHEMAS)]) {
      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
      expect(schema.$id).toMatch(/^archipelia-lobby\/1\//);
      expect(schema.$defs).toBe(SCHEMA_DEFS);
    }
  });
});
