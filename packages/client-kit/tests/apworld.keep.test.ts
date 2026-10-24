/* @layer tests @kind test */
import { utimes } from 'node:fs/promises';
import { join } from 'node:path';
import { strFromU8, unzipSync } from 'fflate';
import { afterEach, describe, expect, test } from 'vitest';
import { buildArchipelagoJson, isKitError, parseArchipelagoJson, readApworld, zipApworld } from '../src';
import { buildApworld, readApworldFile, writeApworld } from '../src/node';
import { ROTP_DATA, ROTP_GAME, ROTP_MODULE, ROTP_WORLD_FILES } from './helpers/rotp-world.constants';
import { cleanTempDirs, makeTempDir } from './helpers/temp-dirs';
import { writeFiles } from './helpers/write-files';

afterEach(cleanTempDirs);

const base = { game: ROTP_GAME, worldVersion: '0.1.0', minimumAp: '0.6.4', data: ROTP_DATA as never };

const worldDirOf = async (files: Readonly<Record<string, string>> = ROTP_WORLD_FILES): Promise<string> => {
  const root = await makeTempDir();
  const dir = join(root, ROTP_MODULE);
  await writeFiles(dir, files);
  return dir;
};

const failureCode = async (run: () => unknown): Promise<string> => {
  try {
    await run();
  } catch (error) {
    if (isKitError(error)) return error.code;
    throw error;
  }
  return 'none';
};

const fileOrder = (bytes: Uint8Array): string[] => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const names: string[] = [];
  for (let offset = 0; offset + 4 <= bytes.length && view.getUint32(offset, true) === 0x04034b50;) {
    const compressed = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    names.push(new TextDecoder().decode(bytes.subarray(offset + 30, offset + 30 + nameLength)));
    offset += 30 + nameLength + extraLength + compressed;
  }
  return names;
};

describe('archipelago.json', () => {
  test('is written with the keys Archipelago reads and format 7 by default', () => {
    const text = buildArchipelagoJson({ ...base, authors: ['Relic of the Past'] });
    expect(text).toBe([
      '{',
      '  "game": "Relic of the Past",',
      '  "world_version": "0.1.0",',
      '  "minimum_ap_version": "0.6.4",',
      '  "authors": [',
      '    "Relic of the Past"',
      '  ],',
      '  "version": 7,',
      '  "compatible_version": 7',
      '}',
      '',
    ].join('\n'));
  });

  test('carries the maximum when given and reads back to the same values', () => {
    const text = buildArchipelagoJson({ ...base, maximumAp: '0.6.8', version: 8, compatibleVersion: 7 });
    expect((JSON.parse(text) as { maximum_ap_version: string }).maximum_ap_version).toBe('0.6.8');
    expect(parseArchipelagoJson(text)).toEqual({
      game: ROTP_GAME,
      worldVersion: '0.1.0',
      minimumAp: '0.6.4',
      maximumAp: '0.6.8',
      version: 8,
      compatibleVersion: 7,
    });
  });

  test.each([
    [{ worldVersion: '1.0' }, 'worldVersion'],
    [{ minimumAp: '0.6' }, 'minimumAp'],
    [{ maximumAp: '0.6.3' }, 'older than minimumAp'],
    [{ version: 0 }, 'version'],
    [{ version: 7, compatibleVersion: 9 }, 'compatibleVersion'],
    [{ game: ' ' }, 'game'],
  ])('refuses %j', (patch, part) => {
    expect(() => buildArchipelagoJson({ ...base, ...patch })).toThrow(part);
  });

  test('parsing explains a broken file', () => {
    expect(() => parseArchipelagoJson('nope')).toThrow('not JSON');
    expect(() => parseArchipelagoJson('{"game": "G"}')).toThrow('world_version');
    expect(() => parseArchipelagoJson('{"game": "G", "world_version": "1.0.0", "minimum_ap_version": "x"}')).toThrow('minimum_ap_version');
  });
});

describe('the apworld build', () => {
  test('holds one package folder, sorted, with the generated files and a fresh manifest', async () => {
    const build = await buildApworld({ ...base, worldDir: await worldDirOf() });
    expect(build.module).toBe(ROTP_MODULE);
    expect(fileOrder(build.bytes)).toEqual([
      `${ROTP_MODULE}/__init__.py`,
      `${ROTP_MODULE}/archipelago.json`,
      `${ROTP_MODULE}/data/game.json`,
      `${ROTP_MODULE}/data/options.json`,
      `${ROTP_MODULE}/items.py`,
      `${ROTP_MODULE}/rules/regions.py`,
    ]);
    const info = readApworld(build.bytes);
    expect(info.module).toBe(ROTP_MODULE);
    expect(info.manifest.game).toBe(ROTP_GAME);
    expect(info.manifest.minimumAp).toBe('0.6.4');
  });

  test('returns the sha256 and size of the bytes', async () => {
    const build = await buildApworld({ ...base, worldDir: await worldDirOf() });
    expect(build.size).toBe(build.bytes.length);
    expect(build.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  test('the same input twice gives the same sha256', async () => {
    const first = await buildApworld({ ...base, worldDir: await worldDirOf() });
    const second = await buildApworld({ ...base, worldDir: await worldDirOf() });
    expect(second.sha256).toBe(first.sha256);
    expect(Buffer.from(second.bytes).equals(Buffer.from(first.bytes))).toBe(true);
  });
});

describe('the apworld is reproducible', () => {
  test('file times, file order on disk and line endings do not change the bytes', async () => {
    const reference = await buildApworld({ ...base, worldDir: await worldDirOf() });
    const crlf = Object.fromEntries(Object.entries(ROTP_WORLD_FILES).map(([name, text]) => [name, text.replaceAll('\n', '\r\n')]));
    const dir = await worldDirOf(crlf);
    await utimes(join(dir, 'items.py'), new Date(2001, 1, 1), new Date(2001, 1, 1));
    const other = await buildApworld({ ...base, worldDir: dir });
    expect(other.sha256).toBe(reference.sha256);
    const kept = await buildApworld({ ...base, worldDir: dir, lineEndings: 'keep' });
    expect(kept.sha256).not.toBe(reference.sha256);
  });

  test('a changed byte changes the hash, and so does the manifest range', async () => {
    const reference = await buildApworld({ ...base, worldDir: await worldDirOf() });
    const edited = await buildApworld({ ...base, worldDir: await worldDirOf({ ...ROTP_WORLD_FILES, 'items.py': 'ITEMS = []\n' }) });
    const ranged = await buildApworld({ ...base, maximumAp: '0.6.8', worldDir: await worldDirOf() });
    expect(new Set([reference.sha256, edited.sha256, ranged.sha256]).size).toBe(3);
  });

  test('entries carry the fixed 1980 time and Unix file permissions', async () => {
    const { bytes } = await buildApworld({ ...base, worldDir: await worldDirOf() });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(view.getUint16(10, true)).toBe(0);
    expect(view.getUint16(12, true)).toBe(0x21);
    const central = fileOrder(bytes).length;
    let offset = bytes.length - 22;
    offset = view.getUint32(offset + 16, true);
    for (let entry = 0; entry < central; entry += 1) {
      expect(view.getUint8(offset + 5)).toBe(3);
      expect(view.getUint32(offset + 38, true) >>> 16).toBe(0o100644);
      offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
    }
  });
});

describe('the apworld folders and data', () => {
  test('a data folder is read from disk and overrides the package folder', async () => {
    const dataFolder = await makeTempDir();
    await writeFiles(dataFolder, { 'game.json': '{"fromDisk":true}\n' });
    const file = join(await makeTempDir(), 'out.apworld');
    const build = await buildApworld({ ...base, data: undefined, dataFolder, worldDir: await worldDirOf({ ...ROTP_WORLD_FILES, 'data/game.json': 'old' }) });
    await writeApworld(file, build.bytes);
    const info = await readApworldFile(file);
    expect(info.entries).toContain(`${ROTP_MODULE}/data/game.json`);
    expect(info.sha256).toBe(build.sha256);
    expect(info.size).toBe(build.size);
    const content = unzipSync(build.bytes)[`${ROTP_MODULE}/data/game.json`];
    expect(strFromU8(content ?? new Uint8Array())).toBe('{"fromDisk":true}\n');
  });

  test('the module name defaults to the folder and can be set', async () => {
    const named = await buildApworld({ ...base, module: 'other_name', worldDir: await worldDirOf() });
    expect(named.module).toBe('other_name');
    expect(readApworld(named.bytes).module).toBe('other_name');
  });

  test.each([
    ['a package without __init__.py', async () => buildApworld({ ...base, worldDir: await worldDirOf({ 'items.py': 'x' }) })],
    ['a bad module name', async () => buildApworld({ ...base, module: 'not-ok', worldDir: await worldDirOf() })],
    ['a missing folder', async () => buildApworld({ ...base, worldDir: join(await makeTempDir(), 'nowhere') })],
    ['an unsafe zip path', () => zipApworld([{ path: 'a/../b', bytes: new Uint8Array() }])],
    ['a duplicate zip path', () => zipApworld([{ path: 'a/b', bytes: new Uint8Array() }, { path: 'a/b', bytes: new Uint8Array() }])],
  ])('refuses %s', async (_label, run) => {
    expect(await failureCode(run)).toBe('invalid-package');
  });

  test('reading refuses what is not an apworld', async () => {
    expect(await failureCode(() => readApworld(new Uint8Array([1, 2, 3])))).toBe('invalid-apworld');
    const two = zipApworld([{ path: 'a/archipelago.json', bytes: new Uint8Array() }, { path: 'b/archipelago.json', bytes: new Uint8Array() }]);
    expect(await failureCode(() => readApworld(two))).toBe('invalid-apworld');
    const none = zipApworld([{ path: 'a/__init__.py', bytes: new Uint8Array() }]);
    expect(await failureCode(() => readApworld(none))).toBe('invalid-apworld');
  });
});
