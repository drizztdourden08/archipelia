/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import { readApworldFile } from '../../node/read-apworld-file';
import { requireValue } from '../require-value';
import { EXIT_OK } from '../cli.constants';

const inspectCommand: Command = async (args, io) => {
  const { positionals } = parseArgs({ args: [...args], options: {}, allowPositionals: true });
  const file = resolve(io.cwd, requireValue(positionals[0], 'the .apworld file'));
  const { module, manifest, entries, sha256, size } = await readApworldFile(file);
  io.out(`${JSON.stringify({ module, manifest, sha256, size, entries: entries.length }, null, 2)}\n`);
  return EXIT_OK;
};

export { inspectCommand };
