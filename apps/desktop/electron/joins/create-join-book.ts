/* @layer electron-main @kind logic */
import type { DataFiles } from '@archipelia/model';
import { JOINS_FILE } from './joins.constants';
import type { JoinRecord } from './joins.type';

const createJoinBook = (files: DataFiles) => {
  let queue: Promise<unknown> = Promise.resolve();
  const list = () => files.readJson<JoinRecord[]>(JOINS_FILE, []);

  const change = (edit: (records: JoinRecord[]) => JoinRecord[]): Promise<void> => {
    const next = queue.then(async () => files.writeJson(JOINS_FILE, edit(await list())));
    queue = next.catch(() => undefined);
    return next;
  };

  return {
    list,
    get: async (id: string) => (await list()).find((record) => record.id === id),
    put: (record: JoinRecord) => change((records) => [...records.filter((entry) => entry.id !== record.id), record]),
    remove: (id: string) => change((records) => records.filter((entry) => entry.id !== id)),
  };
};

export { createJoinBook };
