/* @layer server @kind logic */
import type { CliCommand } from '../cli.type';
import { engineInstallCommand } from './engine-install-command';
import { engineListCommand } from './engine-list-command';
import { engineIdCommand } from './engine-pick-command';

const idCommands = { switch: engineIdCommand('switch'), remove: engineIdCommand('remove') };

const engineCommand: CliCommand = (command, context) => {
  const verb = command.words[0] ?? 'list';
  if (verb === 'list') return engineListCommand(context);
  if (verb === 'install') return engineInstallCommand(command, context);
  if (verb === 'switch' || verb === 'remove') return idCommands[verb](command, context);
  context.err(`Unknown engine command "${verb}". Use list, install, switch or remove.`);
  return Promise.resolve(2);
};

export { engineCommand };
