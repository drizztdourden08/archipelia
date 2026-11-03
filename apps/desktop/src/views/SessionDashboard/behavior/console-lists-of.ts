/* @layer renderer-app @kind logic */
import type { PatternChoice, PatternLists } from '@drizztdourden08/tessera/composites';
import { SERVER_OPTIONS, consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleNamesList } from './console-names-list';
import type { ConsoleRoom } from './console-room.type';

const choicesOf = (values: readonly string[]): readonly PatternChoice[] => values.map((value) => ({ value }));

const consoleListsOf = (players: readonly string[], room: ConsoleRoom): PatternLists => {
  const own = consoleCommands.flatMap((command) => command.params).filter((param) => param.options !== undefined);
  return {
    ...Object.fromEntries(own.map((param) => [param.name, choicesOf(param.options ?? [])])),
    players: choicesOf(players),
    items: consoleNamesList('items', room),
    locations: consoleNamesList('locations', room),
    options: choicesOf(SERVER_OPTIONS.map((option) => option.name)),
  };
};

export { consoleListsOf };
