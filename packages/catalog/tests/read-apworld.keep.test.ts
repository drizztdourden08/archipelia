/* @layer tests @kind test */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { readApworld } from '../src/install/read-apworld';

let dir = '';

const write = async (name: string, entries: Record<string, string>) => {
  const file = join(dir, name);
  await writeFile(file, zipSync(Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, strToU8(v)]))));
  return file;
};

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-apworld-test-'));
});

afterAll(() => rm(dir, { recursive: true, force: true }));

describe('readApworld', () => {
  test('finds the world package and its manifest', async () => {
    const file = await write('demo.apworld', {
      'demo/__init__.py': '', 'demo/data/__init__.py': '', 'demo/archipelago.json': '{"game":"Demo","world_version":"1.2.3"}',
    });
    const info = await readApworld(file);
    expect(info.module).toBe('demo');
    expect(info.manifest).toEqual({ game: 'Demo', world_version: '1.2.3' });
  });

  test('a world without a manifest reads an empty one', async () => {
    const info = await readApworld(await write('bare.apworld', { 'bare/__init__.py': '' }));
    expect(info.manifest).toEqual({});
  });

  test('an archive with two packages is refused', async () => {
    const file = await write('two.apworld', { 'a/__init__.py': '', 'b/__init__.py': '' });
    await expect(readApworld(file)).rejects.toThrow(/found 2/);
  });
});
