/* @layer server @kind logic */
import { USAGE } from './cli.constants';
import type { CliContext, ParsedCommand } from './cli.type';
import { COMMANDS } from './commands/commands.constants';

const runCli = async (command: ParsedCommand, context: CliContext): Promise<number> => {
  const run = Object.entries(COMMANDS).find(([name]) => name === command.name)?.[1];
  if (!run) {
    context.err(`Unknown command "${command.name}".`);
    USAGE.forEach(context.err);
    return 2;
  }
  return run(command, context);
};

export { runCli };
