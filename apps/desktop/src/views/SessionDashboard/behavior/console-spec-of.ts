/* @layer renderer-app @kind logic */
import type { CommandSpec } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ConsoleCommand } from '@archipelia/sessions/console-commands';
import { consoleParamOf } from './console-param-of';

const consoleSpecOf = (command: ConsoleCommand, players: readonly string[]): CommandSpec => ({
  id: command.id,
  label: command.label,
  icon: command.icon as IconName,
  group: command.group,
  description: command.description,
  params: command.params.map((param) => consoleParamOf(param, players)),
  format: command.format,
});

export { consoleSpecOf };
