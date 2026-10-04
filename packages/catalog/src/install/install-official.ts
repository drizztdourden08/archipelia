/* @layer core @kind logic */
import type { DataFiles, EngineRuntime, InstalledGame } from '@archipelia/model';
import { join } from 'node:path';
import { readRuntime } from '@archipelia/engine';
import { officialDir } from '../official/official-dir';
import { readOfficialIndex } from '../official/read-official-index';
import type { OfficialWorld } from '../official/official-index.type';
import { hashDecision } from './hash-decision';
import { hashFile } from './hash-file';
import { commitInstall } from './commit-install';
import { readApworld } from './read-apworld';
import type { InstallOfficialParams } from './install-official.type';
import { listInstalled } from './list-installed';
import { installOrder } from '../official/install-order';

const installOne = async (runtime: EngineRuntime, files: DataFiles, dir: string, world: OfficialWorld) => {
  const file = join(dir, world.file);
  const hash = hashDecision(world.sha256, await hashFile(file), world.file);
  return commitInstall({
    runtime, files, file, info: await readApworld(file), apworld: world.apworld, game: world.game,
    version: runtime.apVersion, source: 'official', layout: world.layout, hash, requires: world.requires,
  });
};

const installOfficial = async ({ engineDir, files, apworld }: InstallOfficialParams): Promise<InstalledGame> => {
  const [runtime, dir, index] = await Promise.all([readRuntime(engineDir), officialDir(engineDir), readOfficialIndex(engineDir)]);
  const installed = new Set((await listInstalled(files)).map((game) => game.apworld));
  let result: InstalledGame | undefined;
  for (const name of installOrder(index, apworld)) {
    if (name !== apworld && installed.has(name)) continue;
    const world = index.find((w) => w.apworld === name);
    if (world) result = await installOne(runtime, files, dir, world);
  }
  if (!result) throw new Error(`${apworld} is not an official world`);
  return result;
};

export { installOfficial };
