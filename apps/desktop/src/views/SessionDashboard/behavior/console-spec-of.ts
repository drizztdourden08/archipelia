/* @layer renderer-app @kind logic */
import type { CommandSpec, PatternLists } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ConsoleCommand, ConsoleParam } from '@archipelia/sessions/console-commands';
import { consolePatternOf } from './console-pattern-of';
import { consoleSlotsOf } from './console-slots-of';

const consoleSpecOf = (command: ConsoleCommand, params: readonly ConsoleParam[], label: string, lists: PatternLists): CommandSpec => ({
  id: params.length === command.params.length ? command.id : `${command.id}-short`,
  label,
  icon: command.icon as IconName,
  group: command.group,
  description: command.description,
  pattern: consolePatternOf(command.id, params),
  setup: { slots: consoleSlotsOf(params), lists },
  format: command.format,
});

export { consoleSpecOf };
