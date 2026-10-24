/* @layer client-kit @kind logic */
import type { ApworldIndex } from './index.type';
import { createFailer } from '../errors/create-failer';
import { isPlainRecord } from '../yaml/emit/is-plain-record';
import { buildApworldIndex } from './build-apworld-index';

const fail = createFailer('invalid-index', 'The apworld index is not valid: ');

const textOf = (record: Record<string, unknown>, key: string): string => {
  const value = record[key];
  return typeof value === 'string' ? value : fail(`${key} must be a text.`);
};

const parseJson = (source: string): unknown => {
  try {
    return JSON.parse(source);
  } catch {
    return fail('the text is not JSON.');
  }
};

const parseApworldIndex = (source: string): ApworldIndex => {
  const record = parseJson(source);
  if (!isPlainRecord(record)) return fail('the top level must be an object.');
  const listed = record.builds;
  if (!Array.isArray(listed) || !listed.every(isPlainRecord)) return fail('builds must be a list of objects.');
  const maximumAp = record.maximumAp === undefined ? undefined : textOf(record, 'maximumAp');
  const index = buildApworldIndex({
    game: textOf(record, 'game'),
    module: textOf(record, 'module'),
    worldVersion: textOf(record, 'worldVersion'),
    appVersion: textOf(record, 'appVersion'),
    minimumAp: textOf(record, 'minimumAp'),
    ...(maximumAp === undefined ? {} : { maximumAp }),
    builds: listed.map((build) => ({
      archipelagoVersion: textOf(build, 'archipelagoVersion'),
      sha256: textOf(build, 'sha256'),
      size: Number(build.size),
    })),
  });
  for (const build of listed) {
    const rule = index.builds.find((candidate) => candidate.archipelagoVersion === build.archipelagoVersion);
    if (rule === undefined || rule.file !== build.file || rule.bundle !== build.bundle) {
      return fail(`the file or bundle name of build ${textOf(build, 'archipelagoVersion')} breaks the naming rule.`);
    }
  }
  return index;
};

export { parseApworldIndex };
