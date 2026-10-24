/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { StoredRuntime } from './read-runtime.type';
import { readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { hasStrings } from './has-strings';
import { RUNTIME_FILE, RUNTIME_KEYS } from './read-runtime.constants';
import { parseJson } from './parse-json';

const isRuntime = (value: unknown): value is StoredRuntime => hasStrings(value, RUNTIME_KEYS);

const readRuntime = async (engineDir: string): Promise<EngineRuntime> => {
  const stored = parseJson(await readFile(join(engineDir, RUNTIME_FILE), 'utf8'), isRuntime, RUNTIME_FILE);
  const at = (path: string) => resolve(engineDir, path);
  return {
    id: stored.id ?? basename(engineDir),
    apVersion: stored.apVersion,
    apCommit: stored.apCommit ?? '',
    pythonVersion: stored.pythonVersion ?? '',
    root: at(stored.root),
    python: at(stored.python),
    generate: at(stored.generate),
    multiServer: at(stored.multiServer),
    schemaScript: at(stored.schemaScript),
  };
};

export { readRuntime };
