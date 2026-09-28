/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { InstallJob } from './commit-install.type';
import { newGames } from './new-games';
import { readGameSchema } from './read-game-schema';
import { listInstalled } from './list-installed';
import { saveInstalled } from './save-installed';
import { placeWorld } from './place-world';
import { placedPath } from './placed-path';

const assertNoClash = (installed: InstalledGame[], apworld: string, path: string, game?: string) => {
  const clash = installed.find((other) => other.apworld !== apworld && (other.path === path || other.game === game));
  if (clash) throw new Error(`${clash.game} is already installed as ${clash.apworld}; remove it first`);
};

const detectGame = async (job: InstallJob, others: InstalledGame[]) => {
  if (job.game) return job.game;
  const found = await newGames(job.runtime, others.map((other) => other.game));
  const [game] = found;
  if (found.length !== 1 || game === undefined) throw new Error(`${job.file}: expected one new game, found ${found.length}`);
  return game;
};

const commitInstall = async (job: InstallJob): Promise<InstalledGame> => {
  const { runtime, files, info, apworld, layout } = job;
  const installed = await listInstalled(files);
  assertNoClash(installed, apworld, placedPath(layout, info.module), job.game);
  const placement = await placeWorld({ runtime, file: job.file, info, layout });
  try {
    const game = await detectGame(job, installed.filter((other) => other.apworld !== apworld));
    assertNoClash(installed, apworld, placement.path, game);
    const schema = await readGameSchema(runtime, game);
    const record: InstalledGame = {
      apworld, game, version: job.version ?? info.manifest.world_version ?? 'unknown', source: job.source,
      installedAt: Date.now(), schema, ...job.hash, layout, path: placement.path, requires: job.requires,
    };
    await saveInstalled(files, record);
    await placement.commit();
    return record;
  } catch (err) {
    await placement.rollback();
    throw err;
  }
};

export { commitInstall };
