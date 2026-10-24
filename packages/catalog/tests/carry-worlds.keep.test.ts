/* @layer tests @kind test */
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { DataEntry, DataFiles, EngineRuntime, InstalledGame } from '@archipelia/model';
import { carryWorlds } from '../src/install/carry-worlds';

let base = '';

const runtimeAt = (name: string): EngineRuntime => ({
  id: name, apVersion: '0.6.7', apCommit: '', pythonVersion: '', root: join(base, name),
  python: '', generate: '', multiServer: '', schemaScript: '',
});

const memoryFiles = (records: InstalledGame[]): DataFiles => {
  const store = new Map(records.map((record) => [`${record.apworld}.json`, record]));
  const unused = () => Promise.reject(new Error('not used by carryWorlds'));
  return {
    path: (rel = '') => rel,
    exists: (rel) => Promise.resolve(store.has(rel)),
    readJson: <T,>(rel: string, fallback: T) => Promise.resolve((store.get(rel) as T | undefined) ?? fallback),
    writeJson: (rel, value) => { store.set(rel, value as InstalledGame); return Promise.resolve(); },
    readText: () => Promise.resolve(null),
    writeText: unused,
    readBytes: () => Promise.resolve(null),
    writeBytes: unused,
    list: () => Promise.resolve([...store.keys()].map((name): DataEntry => ({ name, isDirectory: false }))),
    remove: unused,
  };
};

const recordOf = (apworld: string, patch: Partial<InstalledGame>): InstalledGame => ({
  apworld, game: apworld.toUpperCase(), version: '1.0.0', source: 'index', installedAt: 100,
  schema: { game: apworld, worldVersion: '1', groups: [], options: [], presets: {} }, sha256: '', verified: false,
  layout: 'apworld', path: `custom_worlds/${apworld}.apworld`, requires: [], ...patch,
});

const exists = (path: string) => stat(path).then(() => true, () => false);

beforeAll(async () => {
  base = await mkdtemp(join(tmpdir(), 'archipelia-carry-test-'));
  await mkdir(join(base, 'old/ap/custom_worlds'), { recursive: true });
  await mkdir(join(base, 'old/ap/worlds/folderworld/data'), { recursive: true });
  await writeFile(join(base, 'old/ap/custom_worlds/alpha.apworld'), 'alpha');
  await writeFile(join(base, 'old/ap/worlds/folderworld/__init__.py'), 'init');
  await writeFile(join(base, 'old/ap/worlds/folderworld/data/x.txt'), 'x');
  await mkdir(join(base, 'new/ap/custom_worlds'), { recursive: true });
});

afterAll(() => rm(base, { recursive: true, force: true }));

describe('carryWorlds', () => {
  test('copies files and folders, and reinstalls official worlds from the new engine', async () => {
    const files = memoryFiles([
      recordOf('alpha', {}),
      recordOf('folderworld', { layout: 'folder', path: 'worlds/folderworld', source: 'file' }),
      recordOf('checksfinder', { source: 'official', path: 'custom_worlds/checksfinder.apworld' }),
    ]);
    const reinstalled: string[] = [];
    const result = await carryWorlds({
      from: runtimeAt('old'), to: runtimeAt('new'), files, reinstall: (apworld) => { reinstalled.push(apworld); return Promise.resolve(); },
    });
    expect(result.copied.sort()).toEqual(['alpha', 'folderworld']);
    expect(result.reinstalled).toEqual(['checksfinder']);
    expect(reinstalled).toEqual(['checksfinder']);
    expect(result.problems).toEqual([]);
    expect(await readFile(join(base, 'new/ap/custom_worlds/alpha.apworld'), 'utf8')).toBe('alpha');
    expect(await readFile(join(base, 'new/ap/worlds/folderworld/data/x.txt'), 'utf8')).toBe('x');
    expect(await exists(join(base, 'old/ap/custom_worlds/alpha.apworld'))).toBe(true);
  });

  test('a missing source, an unsafe path and a failed reinstall are problems, not throws', async () => {
    const files = memoryFiles([
      recordOf('ghost', {}),
      recordOf('evil', { path: '../../escape' }),
      recordOf('broken', { source: 'official', path: 'custom_worlds/broken.apworld' }),
    ]);
    const result = await carryWorlds({
      from: runtimeAt('old'), to: runtimeAt('new'), files, reinstall: () => Promise.reject(new Error('pack is missing')),
    });
    expect(result.copied).toEqual([]);
    expect(Object.fromEntries(result.problems.map((problem) => [problem.apworld, problem.reason]))).toEqual({
      ghost: 'custom_worlds/ghost.apworld is missing from the engine it was installed in',
      evil: 'refusing to copy ../../escape',
      broken: 'pack is missing',
    });
  });

  test('since skips records the first pass already carried', async () => {
    const files = memoryFiles([recordOf('alpha', { installedAt: 100 }), recordOf('late', { installedAt: 300 })]);
    await writeFile(join(base, 'old/ap/custom_worlds/late.apworld'), 'late');
    const result = await carryWorlds({ from: runtimeAt('old'), to: runtimeAt('new'), files, reinstall: () => Promise.resolve(), since: 200 });
    expect(result.copied).toEqual(['late']);
  });
});
