/* @layer renderer-app @kind logic */
import type { CommandSpec, PatternLists } from '@drizztdourden08/tessera/composites';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import type { ConsoleCommand } from '@archipelia/sessions/console-commands';
import { consoleListsOf } from './console-lists-of';
import { consoleSpecOf } from './console-spec-of';

const specsOf = (command: ConsoleCommand, lists: PatternLists): readonly CommandSpec[] => {
  const required = command.params.filter((param) => param.optional !== true);
  const full = consoleSpecOf(command, command.params, command.label, lists);
  if (required.length === command.params.length) return [full];
  const skipped = command.params.filter((param) => param.optional === true).map((param) => param.label.toLowerCase());
  return [consoleSpecOf(command, required, `${command.label} (no ${skipped.join(', ')})`, lists), full];
};

const consoleSpecsOf = (players: readonly string[]): readonly CommandSpec[] => {
  const lists = consoleListsOf(players);
  return consoleCommands.flatMap((command) => specsOf(command, lists));
};

export { consoleSpecsOf };
