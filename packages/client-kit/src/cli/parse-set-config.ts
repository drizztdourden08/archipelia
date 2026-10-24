/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import type { BuildSetOptions, SetBuildSpec } from '../node/node.type';
import { createFailer } from '../errors/create-failer';
import { isTextList } from '../manifest/is-text-list';
import { isPlainRecord } from '../yaml/emit/is-plain-record';

const fail = createFailer('invalid-config', 'The set config is not valid: ');

const textOf = (record: Record<string, unknown>, key: string): string => {
  const value = record[key];
  return typeof value === 'string' && value !== '' ? value : fail(`${key} must be a non-empty text.`);
};

const optionalText = (record: Record<string, unknown>, key: string): string | undefined =>
  record[key] === undefined ? undefined : textOf(record, key);

const optionalPath = (record: Record<string, unknown>, key: string, cwd: string): string | undefined => {
  const value = optionalText(record, key);
  return value === undefined ? undefined : resolve(cwd, value);
};

const buildSpecOf = (raw: unknown, cwd: string): SetBuildSpec => {
  if (typeof raw === 'string') return { archipelagoVersion: raw };
  if (!isPlainRecord(raw)) return fail('each build is a version text or an object.');
  return {
    archipelagoVersion: textOf(raw, 'archipelagoVersion'),
    worldDir: optionalPath(raw, 'worldDir', cwd),
    dataFolder: optionalPath(raw, 'dataFolder', cwd),
    minimumAp: optionalText(raw, 'minimumAp'),
    maximumAp: optionalText(raw, 'maximumAp'),
  };
};

const authorsOf = (record: Record<string, unknown>): string[] | undefined => {
  const value = record.authors;
  if (value === undefined) return undefined;
  return isTextList(value) ? value : fail('authors must be a list of texts.');
};

const parseSetConfig = (raw: unknown, cwd: string): BuildSetOptions => {
  if (!isPlainRecord(raw)) return fail('the top level must be an object.');
  if (!Array.isArray(raw.builds) || raw.builds.length === 0) return fail('builds must be a non-empty list.');
  return {
    game: textOf(raw, 'game'),
    module: optionalText(raw, 'module'),
    worldVersion: textOf(raw, 'worldVersion'),
    appVersion: textOf(raw, 'appVersion'),
    minimumAp: textOf(raw, 'minimumAp'),
    maximumAp: optionalText(raw, 'maximumAp'),
    authors: authorsOf(raw),
    worldDir: resolve(cwd, textOf(raw, 'worldDir')),
    dataFolder: optionalPath(raw, 'dataFolder', cwd),
    outDir: resolve(cwd, textOf(raw, 'outDir')),
    builds: (raw.builds as unknown[]).map((build) => buildSpecOf(build, cwd)),
  };
};

export { parseSetConfig };
