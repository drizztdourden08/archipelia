/* @layer core @kind logic */
import { isRecord, isStringList } from '@archipelia/model';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { META_STRING_KEYS } from './engine-meta.constants';
import type { EngineMeta } from './engine-meta.type';
import { hasStrings } from './has-strings';
import { parseJson } from './parse-json';
import { RUNTIME_FILE } from './read-runtime.constants';

const isStoredMeta = (value: unknown): value is Record<string, unknown> =>
  hasStrings(value, META_STRING_KEYS) && typeof (value as Record<string, unknown>).builtAt === 'number';

const readEngineMeta = async (engineDir: string): Promise<EngineMeta> => {
  const stored = parseJson(await readFile(join(engineDir, RUNTIME_FILE), 'utf8'), isStoredMeta, RUNTIME_FILE);
  return {
    pythonRelease: String(stored.pythonRelease),
    target: String(stored.target),
    builtAt: Number(stored.builtAt),
    rules: Array.isArray(stored.rules) ? (stored.rules as EngineMeta['rules']) : [],
    packages: isStringList(stored.packages) ? stored.packages : [],
    ...(isRecord(stored.smoke) ? { smoke: stored.smoke as unknown as NonNullable<EngineMeta['smoke']> } : {}),
  };
};

export { readEngineMeta };
