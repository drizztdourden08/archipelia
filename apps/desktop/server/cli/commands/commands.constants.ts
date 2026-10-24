/* @layer server @kind config */
import { engineCommand } from './engine-command';
import { helpCommand } from './help-command';
import { statusCommand } from './status-command';
import { tokenCommand } from './token-command';

const COMMANDS = { token: tokenCommand, status: statusCommand, engine: engineCommand, help: helpCommand };

export { COMMANDS };
