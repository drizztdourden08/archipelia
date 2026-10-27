/* @layer client-kit @kind logic */
import type { ApworldIndex } from './index.type';
import { createFailer } from '../errors/create-failer';
import { isPlainRecord } from '../yaml/emit/is-plain-record';
import { buildApworldIndex } from './build-apworld-index';
import { checkNaming } from './check-naming';
import { readBuildList } from './read-build-list';
import { readJson } from './read-json';
import { readText } from './read-text';

const fail = createFailer('invalid-index', 'The apworld index is not valid: ');

const parseApworldIndex = (source: string): ApworldIndex => {
  const record = readJson(fail, source);
  if (!isPlainRecord(record)) return fail('the top level must be an object.');
  const { listed, inputs } = readBuildList(fail, record);
  const maximumAp = record.maximumAp === undefined ? undefined : readText(fail, record, 'maximumAp');
  const index = buildApworldIndex({
    game: readText(fail, record, 'game'),
    module: readText(fail, record, 'module'),
    worldVersion: readText(fail, record, 'worldVersion'),
    appVersion: readText(fail, record, 'appVersion'),
    minimumAp: readText(fail, record, 'minimumAp'),
    ...(maximumAp === undefined ? {} : { maximumAp }),
    builds: inputs,
  });
  checkNaming(fail, index.builds, listed);
  return index;
};

export { parseApworldIndex };
