/* @layer tests @kind helper */
import type { DataEntry, DataFiles } from '@archipelia/model';

const memoryFiles = (): DataFiles & { store: Map<string, unknown> } => {
  const store = new Map<string, unknown>();
  return {
    store,
    path: (rel = '') => `/memory/${rel}`,
    exists: (rel) => Promise.resolve(store.has(rel)),
    readJson: <T,>(rel: string, fallback: T) => Promise.resolve(store.has(rel) ? (structuredClone(store.get(rel)) as T) : fallback),
    writeJson: (rel, value) => Promise.resolve(void store.set(rel, structuredClone(value))),
    readText: (rel) => Promise.resolve(typeof store.get(rel) === 'string' ? (store.get(rel) as string) : null),
    writeText: (rel, text) => Promise.resolve(void store.set(rel, text)),
    readBytes: () => Promise.resolve(null),
    writeBytes: () => Promise.resolve(),
    list: () => Promise.resolve([...store.keys()].map((name): DataEntry => ({ name, isDirectory: false }))),
    remove: (rel) => Promise.resolve(void store.delete(rel)),
  };
};

export { memoryFiles };
