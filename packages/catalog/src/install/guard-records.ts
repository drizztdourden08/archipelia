/* @layer core @kind logic */
import type { CarryResult, DataFiles, RecordGuard } from '@archipelia/model';
import { listInstalled } from './list-installed';
import { readInstalled } from './read-installed';
import { saveInstalled } from './save-installed';

const guardRecords = async (files: DataFiles): Promise<RecordGuard> => {
  const records = await listInstalled(files);
  const written = new Map<string, number>();

  const note = async (carry: CarryResult) => {
    for (const apworld of carry.reinstalled) {
      const current = await readInstalled(files, apworld);
      if (current) written.set(apworld, current.installedAt);
    }
  };

  const restore = async () => {
    const restored: string[] = [];
    for (const original of records) {
      const at = written.get(original.apworld);
      if (at === undefined) continue;
      const current = await readInstalled(files, original.apworld);
      if (current?.installedAt !== at) continue;
      await saveInstalled(files, original);
      restored.push(original.apworld);
    }
    return restored;
  };

  return { records, note, restore };
};

export { guardRecords };
