/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import { buildApworld } from '../../node/build-apworld';
import { writeApworld } from '../../node/write-apworld';
import { requireValue } from '../require-value';
import { EXIT_OK } from '../cli.constants';
import { BUILD_APWORLD_OPTIONS } from './build-apworld-command.constants';

const buildApworldCommand: Command = async (args, io) => {
  const { values } = parseArgs({ args: [...args], options: BUILD_APWORLD_OPTIONS, allowPositionals: false });
  const out = resolve(io.cwd, requireValue(values.out, '--out'));
  const lineEndings = values['line-endings'] === 'keep' ? 'keep' : 'lf';
  const build = await buildApworld({
    worldDir: resolve(io.cwd, requireValue(values.world, '--world')),
    game: requireValue(values.game, '--game'),
    worldVersion: requireValue(values['world-version'], '--world-version'),
    minimumAp: requireValue(values['minimum-ap'], '--minimum-ap'),
    maximumAp: values['maximum-ap'],
    module: values.module,
    dataFolder: values.data === undefined ? undefined : resolve(io.cwd, values.data),
    authors: values.author,
    exclude: values.exclude,
    lineEndings,
  });
  await writeApworld(out, build.bytes);
  io.out(`${JSON.stringify({ file: out, module: build.module, sha256: build.sha256, size: build.size })}\n`);
  return EXIT_OK;
};

export { buildApworldCommand };
