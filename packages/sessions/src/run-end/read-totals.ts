/* @layer core @kind logic */
import type { DataFiles, Session } from '@archipelia/model';
import { itemTypesName } from './item-types-name';
import { totalsOf } from './totals-of';

const readTotals = async (files: DataFiles, { id, output }: Session): Promise<Record<string, number> | undefined> => {
  const name = itemTypesName(output);
  if (!name) return undefined;
  const parsed = await files.readJson<unknown>(`${id}/output/${name}`, null).catch(() => null);
  return totalsOf(parsed);
};

export { readTotals };
