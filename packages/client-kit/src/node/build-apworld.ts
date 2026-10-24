/* @layer client-kit @kind logic */
import { basename, resolve } from 'node:path';
import type { ApworldEntry } from '../zip/zip.type';
import type { ApworldBuild, BuildApworldOptions } from './node.type';
import { assembleApworld } from '../apworld/assemble-apworld';
import { DEFAULT_DATA_DIR } from '../apworld/apworld.constants';
import { collectPackage } from './collect-package';
import { sha256Hex } from './sha256-hex';

const generatedFiles = async (options: BuildApworldOptions): Promise<ApworldEntry[]> => {
  const { dataFolder, dataDir = DEFAULT_DATA_DIR, lineEndings } = options;
  if (dataFolder === undefined) return [];
  const found = await collectPackage(dataFolder, { lineEndings });
  return found.map(({ path, bytes }) => ({ path: `${dataDir}/${path}`, bytes }));
};

const buildApworld = async (options: BuildApworldOptions): Promise<ApworldBuild> => {
  const { worldDir, module = basename(resolve(worldDir)), exclude, lineEndings } = options;
  const own = await collectPackage(worldDir, { exclude, lineEndings });
  const generated = await generatedFiles(options);
  const replaced = new Set(generated.map(({ path }) => path));
  const files = [...own.filter(({ path }) => !replaced.has(path)), ...generated];
  const assembled = assembleApworld({ ...options, module, files });
  return { ...assembled, sha256: sha256Hex(assembled.bytes), size: assembled.bytes.length };
};

export { buildApworld };
