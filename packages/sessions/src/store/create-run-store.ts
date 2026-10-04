/* @layer core @kind logic */
import { createRecordStore } from '@archipelia/presets';
import type { DataFiles, Session } from '@archipelia/model';
import { RUNS_DIR } from './session-stores.constants';

const createRunStore = (files: DataFiles) => {
  const records = createRecordStore<Session>(files, RUNS_DIR);
  const newest = async () => (await records.list()).sort((a, b) => b.createdAt - a.createdAt);
  return { ...records, newest };
};

export { createRunStore };
