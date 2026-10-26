/* @layer tests @kind test */
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createIgnore } from '../src/official/apignore.mjs';
import { readGlobalIgnore, readWorld } from '../src/official/pack-world.mjs';

let apDir;

beforeEach(async () => {
  apDir = await mkdtemp(join(tmpdir(), 'ap-global-ignore-'));
  await mkdir(join(apDir, 'data'), { recursive: true });
  await mkdir(join(apDir, 'worlds', 'demo', '__pycache__'), { recursive: true });
  await writeFile(join(apDir, 'worlds', 'demo', '__init__.py'), 'x = 1\n');
  await writeFile(join(apDir, 'worlds', 'demo', '__pycache__', 'a.pyc'), 'x');
});

afterEach(async () => {
  await rm(apDir, { recursive: true, force: true });
});

describe('readGlobalIgnore', () => {
  test('an engine without GLOBAL.apignore (0.6.6) falls back to the built-in rules', async () => {
    const ignore = createIgnore(await readGlobalIgnore(apDir));
    expect(ignore('__pycache__/a.pyc')).toBe(true);
    expect(ignore('__MACOSX/x')).toBe(true);
    expect(ignore('.DS_Store')).toBe(true);
    expect(ignore('__init__.py')).toBe(false);
  });

  test('a world still packs its files without GLOBAL.apignore', async () => {
    const globalIgnore = await readGlobalIgnore(apDir);
    const world = await readWorld({ worldsDir: join(apDir, 'worlds'), globalIgnore, name: 'demo' });
    expect(world.files.map((f) => f.path)).toEqual(['__init__.py']);
  });

  test('the file the engine ships wins over the built-in rules', async () => {
    await writeFile(join(apDir, 'data', 'GLOBAL.apignore'), '# c\n/only.txt\n');
    const ignore = createIgnore(await readGlobalIgnore(apDir));
    expect(ignore('only.txt')).toBe(true);
    expect(ignore('__pycache__/a.pyc')).toBe(false);
  });
});
