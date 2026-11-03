/* @layer renderer-app @kind logic */
import type { CommandSpec } from '@drizztdourden08/tessera/composites';
import { consoleCommands } from '@archipelia/sessions/console-commands';
import { consoleSpecOf } from './console-spec-of';

const consoleSpecsOf = (players: readonly string[]): readonly CommandSpec[] => consoleCommands.map((command) => consoleSpecOf(command, players));

export { consoleSpecsOf };
