/* @layer renderer-app @kind logic */
import type { CommandSpec } from '@drizztdourden08/tessera/composites';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleListsOf } from './console-lists-of';
import { consoleSpecOf } from './console-spec-of';

const consoleSpecsOf = (players: readonly string[]): readonly CommandSpec[] => {
  const lists = consoleListsOf(players);
  return consoleCommands.map((command) => consoleSpecOf(command, lists));
};

export { consoleSpecsOf };
