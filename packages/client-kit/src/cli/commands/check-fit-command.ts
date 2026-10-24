/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import { readApworldFile } from '../../node/read-apworld-file';
import { checkWorldFit } from '../../versions/check-world-fit';
import { requireValue } from '../require-value';
import { EXIT_FAILED, EXIT_OK } from '../cli.constants';

const checkFitCommand: Command = async (args, io) => {
  const { values, positionals } = parseArgs({ args: [...args], options: { ap: { type: 'string' } }, allowPositionals: true });
  const file = resolve(io.cwd, requireValue(positionals[0], 'the .apworld file'));
  const ap = requireValue(values.ap, '--ap');
  const { manifest } = await readApworldFile(file);
  const fit = checkWorldFit(manifest, ap);
  if (fit.fits) {
    io.out(`${manifest.game} ${manifest.worldVersion} fits Archipelago ${ap}.\n`);
    return EXIT_OK;
  }
  io.err(`${fit.message}\n`);
  return EXIT_FAILED;
};

export { checkFitCommand };
