/* @layer tests @kind test */
import type { DataEntry, DataFiles, InstalledGame } from '@archipelia/model';

const memoryFiles = (records: InstalledGame[]): DataFiles => {
  const store = new Map<string, unknown>(records.map((record) => [`${record.apworld}.json`, record]));
  const unused = () => Promise.reject(new Error('not used by this test'));
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

const textFiles = (): DataFiles => {
  const store = new Map<string, string>();
  return {
    ...memoryFiles([]),
    readText: (rel) => Promise.resolve(store.get(rel) ?? null),
    writeText: (rel, body) => { store.set(rel, body); return Promise.resolve(); },
  };
};

const recordOf = (apworld: string, patch: Partial<InstalledGame> = {}): InstalledGame => ({
  apworld, game: apworld.toUpperCase(), version: '0.6.7', source: 'official', installedAt: 100,
  schema: { game: apworld, worldVersion: '1', groups: [], options: [], presets: {} }, sha256: '', verified: false,
  layout: 'apworld', path: `worlds/${apworld}.apworld`, requires: [], ...patch,
});

export { memoryFiles, recordOf, textFiles };
