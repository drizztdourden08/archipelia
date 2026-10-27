/* @layer client-kit @kind config */
import type { Command } from './cli.type';
import { buildApworldCommand } from './commands/build-apworld-command';
import { buildSetCommand } from './commands/build-set-command';
import { checkFitCommand } from './commands/check-fit-command';
import { inspectCommand } from './commands/inspect-command';
import { playerYamlCommand } from './commands/player-yaml-command';
import { releaseFilesCommand } from './commands/release-files-command';

const COMMANDS: Readonly<Record<string, Command>> = {
  'build-apworld': buildApworldCommand,
  'build-set': buildSetCommand,
  'release-files': releaseFilesCommand,
  inspect: inspectCommand,
  'check-fit': checkFitCommand,
  'player-yaml': playerYamlCommand,
};

const HELP_WORDS: readonly string[] = ['help', '--help', '-h'];

export { COMMANDS, HELP_WORDS };
