/* @layer server @kind logic */
import type { CliContext, ParsedCommand } from '../cli.type';
import { withCore } from '../with-core';

const engineIdCommand = (verb: 'switch' | 'remove') => async (command: ParsedCommand, context: CliContext): Promise<number> => {
  const id = command.words[1];
  if (!id) {
    context.err(`Name the engine: engine ${verb} <id>. The ids are in engine list.`);
    return 2;
  }
  await withCore(context, (core) => (verb === 'switch' ? core.engine.switchTo(id) : core.engine.remove(id)));
  context.out(verb === 'switch' ? `Engine ${id} is now active.` : `Engine ${id} is removed.`);
  return 0;
};

export { engineIdCommand };
