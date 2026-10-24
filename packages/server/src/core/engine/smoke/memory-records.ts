/* @layer core @kind logic */
import type { DataEntry, DataFiles } from '@archipelia/model';

const memoryRecords = (): DataFiles => {
  const store = new Map<string, unknown>();
  const text = new Map<string, string>();
  const bytes = new Map<string, Uint8Array>();
  return {
    path: (rel = '') => rel,
    exists: (rel) => Promise.resolve(store.has(rel) || text.has(rel) || bytes.has(rel)),
    readJson: <T>(rel: string, fallback: T) => Promise.resolve(store.has(rel) ? (store.get(rel) as T) : fallback),
    writeJson: (rel, value) => { store.set(rel, value); return Promise.resolve(); },
    readText: (rel) => Promise.resolve(text.get(rel) ?? null),
    writeText: (rel, value) => { text.set(rel, value); return Promise.resolve(); },
    readBytes: (rel) => Promise.resolve(bytes.get(rel) ?? null),
    writeBytes: (rel, data) => { bytes.set(rel, data); return Promise.resolve(); },
    list: () => Promise.resolve([...store.keys()].map((name): DataEntry => ({ name, isDirectory: false }))),
    remove: (rel) => { store.delete(rel); text.delete(rel); bytes.delete(rel); return Promise.resolve(); },
  };
};

export { memoryRecords };
