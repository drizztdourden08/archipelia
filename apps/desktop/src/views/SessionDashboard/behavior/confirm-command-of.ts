/* @layer renderer-app @kind logic */
import { consoleCommands } from '@archipelia/sessions/console-commands';
import type { ConsoleCommand } from '@archipelia/sessions/console-commands';

const VERB = /^\/(\S+)/;

const confirmCommandOf = (line: string): ConsoleCommand | undefined => {
  const verb = VERB.exec(line.trim())?.[1];
  return consoleCommands.find((command) => command.confirm === true && command.id === verb);
};

export { confirmCommandOf };
