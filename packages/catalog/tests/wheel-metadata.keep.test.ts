/* @layer tests @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { readWheelMetadata } from '@archipelia/engine';
import { strToU8, zipSync } from 'fflate';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { wheelBytes } from './wheel.fixtures';

let dir = '';

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-wheel-metadata-'));
});

afterAll(() => rm(dir, { recursive: true, force: true }));

const fileOf = async (name: string, bytes: Uint8Array) => {
  const path = join(dir, name);
  await writeFile(path, bytes);
  return path;
};

describe('reading the metadata of a wheel without running it', () => {
  test('reads the name, the version, the dependencies and the top level modules', async () => {
    const bytes = wheelBytes({
      requires: ['numpy==2.5.1', 'colorama (>=0.4) ; sys_platform == "win32"', 'pytest>=8; extra == "test"'], modules: ['ctrando', 'ctrando_data'],
    });
    const found = await readWheelMetadata(await fileOf('a.whl', bytes));
    expect(found).toMatchObject({ name: 'ctrando', version: '1.2.0', requires: ['numpy==2.5.1', 'colorama>=0.4 ; sys_platform == "win32"'] });
    expect(found.modules.sort()).toEqual(['ctrando', 'ctrando_data']);
  });

  test('finds single file modules and compiled modules', async () => {
    const bytes = zipSync({
      'x-1.dist-info/METADATA': strToU8('Name: x\nVersion: 1'), 'single.py': strToU8(''), 'fast.cp312-win_amd64.pyd': strToU8(''), 'x-1.data/scripts/run': strToU8(''),
    });
    expect((await readWheelMetadata(await fileOf('b.whl', bytes))).modules.sort()).toEqual(['fast', 'single']);
  });

  test('refuses a file with no METADATA, two of them, no name, or that is not a zip', async () => {
    await expect(readWheelMetadata(await fileOf('c.whl', zipSync({ 'a.py': strToU8('') })))).rejects.toThrow('no single METADATA');
    const two = zipSync({ 'a-1.dist-info/METADATA': strToU8('Name: a\nVersion: 1'), 'b-1.dist-info/METADATA': strToU8('Name: b\nVersion: 1') });
    await expect(readWheelMetadata(await fileOf('d.whl', two))).rejects.toThrow('no single METADATA');
    await expect(readWheelMetadata(await fileOf('e.whl', zipSync({ 'a-1.dist-info/METADATA': strToU8('Version: 1') })))).rejects.toThrow('no usable name and version');
    await expect(readWheelMetadata(await fileOf('f.whl', strToU8('not a zip')))).rejects.toThrow();
  });
});
