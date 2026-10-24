/* @layer server @kind logic */
import { engineChoice } from '../../engine/engine-choice';
import type { CliContext, ParsedCommand } from '../cli.type';
import { withCore } from '../with-core';

const engineInstallCommand = async (command: ParsedCommand, context: CliContext): Promise<number> => {
  const ap = command.words[1];
  if (!ap) {
    context.err('Name the Archipelago version: engine install <ap> [--python <version>]');
    return 2;
  }
  return withCore(context, async (core) => {
    const result = await core.engine.install(await engineChoice(core, ap, command.flags.python ?? ''));
    if (result.outcome === 'failed' || result.outcome === 'cancelled') {
      context.err(`Archipelago ${ap} did not install: ${result.error ?? result.outcome}`);
      return 1;
    }
    context.out(`Archipelago ${ap} is installed (${result.outcome}).`);
    return 0;
  });
};

export { engineInstallCommand };
