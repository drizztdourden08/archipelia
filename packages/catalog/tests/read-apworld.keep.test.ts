/* @layer tests @kind test */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { lieAboutSize } from '@archipelia/model/testing';
import { readApworld } from '../src/install/read-apworld';
import { writeZip } from './zip-file.fixtures';

let dir = '';

const write = (name: string, entries: Record<string, string>) => writeZip(dir, name, entries);

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

  test('I-81: an archive that declares more than an apworld may hold is refused', async () => {
    const zip = zipSync({ 'demo/__init__.py': strToU8(''), 'demo/data.bin': new Uint8Array(1000) });
    const file = join(dir, 'bomb.apworld');
    await writeFile(file, lieAboutSize(zip, 512 * 1024 * 1024));
    await expect(readApworld(file)).rejects.toThrow('larger than this server takes');
  });

  test('I-81: a manifest that lies about its size is stopped', async () => {
    const zip = zipSync({ 'demo/__init__.py': strToU8(''), 'demo/archipelago.json': new Uint8Array(1024 * 1024) });
    const file = join(dir, 'liar.apworld');
    await writeFile(file, lieAboutSize(zip, 2048, 1));
    await expect(readApworld(file)).rejects.toThrow('inflates past its declared size');
  });
});
