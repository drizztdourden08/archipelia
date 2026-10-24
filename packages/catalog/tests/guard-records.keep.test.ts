/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { DataEntry, DataFiles, InstalledGame } from '@archipelia/model';
import { guardRecords } from '../src/install/guard-records';

const memoryFiles = (records: InstalledGame[]): DataFiles => {
  const store = new Map<string, unknown>(records.map((record) => [`${record.apworld}.json`, record]));
  const unused = () => Promise.reject(new Error('not used by guardRecords'));
  return {
    path: (rel = '') => rel,
    exists: (rel) => Promise.resolve(store.has(rel)),
    readJson: <T,>(rel: string, fallback: T) => Promise.resolve((store.get(rel) as T | undefined) ?? fallback),
    writeJson: (rel, value) => { store.set(rel, value); return Promise.resolve(); },
    readText: () => Promise.resolve(null),
    writeText: unused,
    readBytes: () => Promise.resolve(null),
    writeBytes: unused,
    list: () => Promise.resolve([...store.keys()].map((name): DataEntry => ({ name, isDirectory: false }))),
    remove: (rel) => { store.delete(rel); return Promise.resolve(); },
  };
};

const recordOf = (apworld: string, patch: Partial<InstalledGame> = {}): InstalledGame => ({
  apworld, game: apworld.toUpperCase(), version: '0.6.7', source: 'official', installedAt: 100,
  schema: { game: apworld, worldVersion: '1', groups: [], options: [], presets: {} }, sha256: '', verified: false,
  layout: 'apworld', path: `worlds/${apworld}.apworld`, requires: [], ...patch,
});

const carried = (reinstalled: string[]) => ({ copied: [], reinstalled, problems: [], at: 150 });

const read = (files: DataFiles, apworld: string) => files.readJson<InstalledGame | null>(`${apworld}.json`, null);

describe('guardRecords', () => {
  test('puts back the records a carry rewrote for the new engine', async () => {
    const files = memoryFiles([recordOf('alpha'), recordOf('beta')]);
    const guard = await guardRecords(files);
    await files.writeJson('beta.json', recordOf('beta', { version: '0.6.8', installedAt: 200 }));
    await guard.note(carried(['beta']));
    expect(await guard.restore()).toEqual(['beta']);
    expect((await read(files, 'beta'))?.version).toBe('0.6.7');
    expect((await read(files, 'alpha'))?.installedAt).toBe(100);
  });

  test('leaves a record the owner changed after the carry', async () => {
    const files = memoryFiles([recordOf('beta')]);
    const guard = await guardRecords(files);
    await files.writeJson('beta.json', recordOf('beta', { version: '0.6.8', installedAt: 200 }));
    await guard.note(carried(['beta']));
    await files.writeJson('beta.json', recordOf('beta', { version: '2.0.0', installedAt: 300 }));
    expect(await guard.restore()).toEqual([]);
    expect((await read(files, 'beta'))?.version).toBe('2.0.0');
  });

  test('restores nothing when no carry was noted, and a second restore is harmless', async () => {
    const files = memoryFiles([recordOf('beta')]);
    const guard = await guardRecords(files);
    expect(await guard.restore()).toEqual([]);
    await files.writeJson('beta.json', recordOf('beta', { version: '0.6.8', installedAt: 200 }));
    await guard.note(carried(['beta']));
    await guard.restore();
    expect(await guard.restore()).toEqual([]);
    expect((await read(files, 'beta'))?.version).toBe('0.6.7');
  });
});
