/* @layer client-kit @kind logic */
import type { CliIo } from './cli.type';
import { EXIT_OK, EXIT_USAGE, USAGE } from './cli.constants';
import { exitCodeOf } from './exit-code-of';
import { COMMANDS, HELP_WORDS } from './run-cli.constants';

const runCli = async (argv: readonly string[], io: CliIo): Promise<number> => {
  const [name, ...rest] = argv;
  if (name === undefined) {
    io.out(USAGE);
    return EXIT_USAGE;
  }
  if (HELP_WORDS.includes(name)) {
    io.out(USAGE);
    return EXIT_OK;
  }
  const command = Object.hasOwn(COMMANDS, name) ? COMMANDS[name] : undefined;
  if (command === undefined) {
    io.err(`archipelia-kit: unknown command "${name}".\n${USAGE}`);
    return EXIT_USAGE;
  }
  try {
    return await command(rest, io);
  } catch (error) {
    io.err(`archipelia-kit: ${error instanceof Error ? error.message : String(error)}\n`);
    return exitCodeOf(error);
  }
};

export { runCli };
