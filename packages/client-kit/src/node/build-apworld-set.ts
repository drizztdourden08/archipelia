/* @layer client-kit @kind logic */
import { copyFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import type { BuildSetOptions, SetBuildSpec, SetFile, SetResult } from './node.type';
import { createKitError } from '../errors/create-kit-error';
import { apworldNames } from '../index-manifest/apworld-names';
import { buildApworldIndex } from '../index-manifest/build-apworld-index';
import { newestBuild } from '../index-manifest/newest-build';
import { serializeApworldIndex } from '../index-manifest/serialize-apworld-index';
import { checkWorldFit } from '../versions/check-world-fit';
import { buildApworld } from './build-apworld';
import { writeApworld } from './write-apworld';

const buildOne = async (options: BuildSetOptions, module: string, spec: SetBuildSpec): Promise<SetFile> => {
  const { game, worldVersion, authors, version, compatibleVersion, data, dataDir, exclude, lineEndings } = options;
  const minimumAp = spec.minimumAp ?? options.minimumAp;
  const maximumAp = spec.maximumAp ?? options.maximumAp;
  const fit = checkWorldFit({ game, worldVersion, minimumAp, maximumAp }, spec.archipelagoVersion);
  if (!fit.fits) throw createKitError('invalid-input', `Build for Archipelago ${spec.archipelagoVersion}: ${fit.message}`);
  const build = await buildApworld({
    game, worldVersion, authors, version, compatibleVersion, data, dataDir, exclude, lineEndings, module, minimumAp, maximumAp,
    worldDir: spec.worldDir ?? options.worldDir,
    dataFolder: spec.dataFolder ?? options.dataFolder,
  });
  const { file, bundle } = apworldNames(module, spec.archipelagoVersion);
  const path = join(options.outDir, file);
  await writeApworld(path, build.bytes);
  return { archipelagoVersion: spec.archipelagoVersion, file, path, sha256: build.sha256, size: build.size, bundle };
};

const buildApworldSet = async (options: BuildSetOptions): Promise<SetResult> => {
  const { game, worldVersion, appVersion, minimumAp, maximumAp, outDir, builds } = options;
  const module = options.module ?? basename(resolve(options.worldDir));
  const files: SetFile[] = [];
  for (const spec of builds) files.push(await buildOne(options, module, spec));
  const index = buildApworldIndex({
    game,
    module,
    worldVersion,
    appVersion,
    minimumAp,
    maximumAp,
    builds: files.map(({ archipelagoVersion, sha256, size }) => ({ archipelagoVersion, sha256, size })),
  });
  const newest = files.find((entry) => entry.file === newestBuild(index)?.file);
  if (newest === undefined) throw createKitError('invalid-input', 'At least one build is needed.');
  const names = apworldNames(module, newest.archipelagoVersion);
  const latestPath = join(outDir, names.latest);
  const indexPath = join(outDir, names.index);
  await copyFile(newest.path, latestPath);
  await writeFile(indexPath, serializeApworldIndex(index));
  return { index, indexPath, latestPath, files };
};

export { buildApworldSet };
