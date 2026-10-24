/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import { buildApworldSet } from '../../node/build-apworld-set';
import { parseSetConfig } from '../parse-set-config';
import { readJsonFile } from '../read-json-file';
import { requireValue } from '../require-value';
import { EXIT_OK } from '../cli.constants';

const buildSetCommand: Command = async (args, io) => {
  const { values } = parseArgs({ args: [...args], options: { config: { type: 'string' } }, allowPositionals: false });
  const raw = await readJsonFile(resolve(io.cwd, requireValue(values.config, '--config')));
  const result = await buildApworldSet(parseSetConfig(raw, io.cwd));
  const files = result.files.map(({ archipelagoVersion, path, sha256, size }) => ({ archipelagoVersion, file: path, sha256, size }));
  io.out(`${JSON.stringify({ index: result.indexPath, latest: result.latestPath, files })}\n`);
  return EXIT_OK;
};

export { buildSetCommand };
