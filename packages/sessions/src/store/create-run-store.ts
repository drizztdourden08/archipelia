/* @layer core @kind logic */
import { createRecordStore } from '@archipelia/presets';
import { runOf } from '@archipelia/model';
import type { DataFiles, Session, StoredRun } from '@archipelia/model';
import type { TemplateLookup } from './session-stores.type';
import { RUNS_DIR } from './session-stores.constants';

const none: TemplateLookup = () => Promise.resolve([]);

const once = (lookup: TemplateLookup): TemplateLookup => {
  let found: ReturnType<TemplateLookup> | undefined;
  return () => (found ??= lookup());
};

const migrated = async (stored: StoredRun, lookup: TemplateLookup): Promise<Session> =>
  runOf(stored, stored.source ? [] : await lookup());

const createRunStore = (files: DataFiles, templates: TemplateLookup = none) => {
  const records = createRecordStore<StoredRun>(files, RUNS_DIR);
  const get = async (id: string): Promise<Session | null> => {
    const stored = await records.get(id);
    return stored ? migrated(stored, templates) : null;
  };
  const list = async (): Promise<Session[]> => {
    const lookup = once(templates);
    return Promise.all((await records.list()).map((stored) => migrated(stored, lookup)));
  };
  const put = async (run: Session): Promise<Session> => {
    await records.put(run);
    return run;
  };
  const newest = async () => (await list()).sort((a, b) => b.createdAt - a.createdAt);
  return { get, list, put, remove: records.remove, newest };
};

export { createRunStore };
