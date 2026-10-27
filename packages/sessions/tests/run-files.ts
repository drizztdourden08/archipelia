/* @layer tests @kind logic */
import type { DataFiles } from '@archipelia/model';

const NOT_USED = 'this test does not use that file operation';

const runFiles = (records: Record<string, unknown>): DataFiles => {
  const notUsed = () => Promise.reject(new Error(NOT_USED));
  return {
    path: (rel = '') => rel,
    exists: (rel) => Promise.resolve(rel in records),
    readJson: <T,>(rel: string, fallback: T) => Promise.resolve(rel in records ? (records[rel] as T) : fallback),
    writeJson: (rel, value) => Promise.resolve(void (records[rel] = value)),
    list: () => Promise.resolve(Object.keys(records).map((rel) => ({ name: rel.split('/').pop() ?? rel, isDirectory: false }))),
    remove: (rel) => Promise.resolve(void delete records[rel]),
    readText: notUsed,
    writeText: notUsed,
    readBytes: notUsed,
    writeBytes: notUsed,
  };
};

export { runFiles };
