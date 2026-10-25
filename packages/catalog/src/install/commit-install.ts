/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { InstallJob } from './commit-install.type';
import type { LoadContext } from './load-failure.type';
import { assertPackagesAccepted } from './assert-packages-accepted';
import { installWorldPackages } from './install-world-packages';
import { loadFailure } from './load-failure';
import { newGames } from './new-games';
import { readGameSchema } from './read-game-schema';
import { listInstalled } from './list-installed';
import { saveInstalled } from './save-installed';
import { placeWorld } from './place-world';
import { placedPath } from './placed-path';
import { worldPackages } from './world-packages';

const assertNoClash = (installed: InstalledGame[], apworld: string, path: string, game?: string) => {
  const clash = installed.find((other) => other.apworld !== apworld && (other.path === path || other.game === game));
  if (clash) throw new Error(`${clash.game} is already installed as ${clash.apworld}; remove it first`);
};

const detectGame = async (job: InstallJob, others: InstalledGame[], context: LoadContext) => {
  if (job.game) return job.game;
  const { games, read } = await newGames(job.runtime, others.map((other) => other.game));
  const [game] = games;
  if (games.length === 0 && read.failedWorlds.includes(context.module)) throw new Error(loadFailure(read, context.label, context));
  if (games.length !== 1 || game === undefined) throw new Error(`${job.file}: expected one new game, found ${games.length}`);
  return game;
};

const commitInstall = async (job: InstallJob): Promise<InstalledGame> => {
  const { runtime, files, info, apworld, layout } = job;
  const label = job.game ?? apworld;
  const packages = job.source === 'official' ? [] : worldPackages(info, label);
  assertPackagesAccepted(label, packages, job.packages);
  const installed = await listInstalled(files);
  assertNoClash(installed, apworld, placedPath(layout, info.module), job.game);
  const placement = await placeWorld({ runtime, file: job.file, info, layout });
  try {
    await installWorldPackages(runtime, label, packages);
    const context: LoadContext = { label, module: info.module, packages };
    const game = await detectGame(job, installed.filter((other) => other.apworld !== apworld), context);
    assertNoClash(installed, apworld, placement.path, game);
    const schema = await readGameSchema(runtime, game, { ...context, label: game });
    const record: InstalledGame = {
      apworld, game, version: job.version ?? info.manifest.world_version ?? 'unknown', source: job.source,
      installedAt: Date.now(), schema, ...job.hash, layout, path: placement.path, requires: job.requires,
      ...(packages.length > 0 ? { packages } : {}),
      ...(job.trust ? { trust: job.trust } : {}),
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
