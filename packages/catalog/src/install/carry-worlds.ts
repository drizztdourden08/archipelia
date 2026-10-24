/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { CarryProblem, CarryResult, CarryWorldsParams } from './carry-worlds.type';
import { copyPlacedWorld } from './copy-placed-world';
import { listInstalled } from './list-installed';

const carryWorlds = async ({ from, to, files, reinstall, since = 0 }: CarryWorldsParams): Promise<CarryResult> => {
  const at = Date.now();
  const records = (await listInstalled(files)).filter((record) => record.installedAt > since);
  const result: CarryResult = { copied: [], reinstalled: [], problems: [], at };
  const fail = (record: InstalledGame, err: unknown): CarryProblem => ({
    apworld: record.apworld, game: record.game, reason: err instanceof Error ? err.message : String(err),
  });
  for (const record of records.filter((entry) => entry.source === 'official')) {
    if (result.reinstalled.includes(record.apworld)) continue;
    await reinstall(record.apworld).then(
      () => { result.reinstalled.push(record.apworld); },
      (err: unknown) => { result.problems.push(fail(record, err)); },
    );
  }
  for (const record of records.filter((entry) => entry.source !== 'official')) {
    await copyPlacedWorld({ from, to, record }).then(
      () => { result.copied.push(record.apworld); },
      (err: unknown) => { result.problems.push(fail(record, err)); },
    );
  }
  return result;
};

export { carryWorlds };
