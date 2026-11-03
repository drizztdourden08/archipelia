/* @layer renderer-app @kind logic */
import { consoleCommands } from '@archipelia/sessions/console-commands';
import type { ConsoleCommand } from '@archipelia/sessions/console-commands';
import { VERB } from './confirm-command-of.constants';

const confirmCommandOf = (line: string): ConsoleCommand | undefined => {
  const verb = VERB.exec(line.trim())?.[1];
  return consoleCommands.find((command) => command.confirm === true && command.id === verb);
};

export { confirmCommandOf };
