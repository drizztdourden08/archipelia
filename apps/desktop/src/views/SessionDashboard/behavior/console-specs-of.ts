/* @layer renderer-app @kind logic */
import type { CommandSpec } from '@drizztdourden08/tessera/composites';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleListsOf } from './console-lists-of';
import { NO_ROOM } from './console-room.constants';
import type { ConsoleRoom } from './console-room.type';
import { consoleSpecOf } from './console-spec-of';

const consoleSpecsOf = (players: readonly string[], room: ConsoleRoom = NO_ROOM): readonly CommandSpec[] => {
  const lists = consoleListsOf(players, room);
  return consoleCommands.map((command) => consoleSpecOf(command, lists));
};

export { consoleSpecsOf };
