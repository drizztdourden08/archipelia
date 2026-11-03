/* @layer renderer-app @kind logic */
import type { CommandSpec, PatternLists } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ConsoleCommand } from '@archipelia/sessions/console-commands';
import { consolePatternOf } from './console-pattern-of';
import { consoleSlotsOf } from './console-slots-of';

const consoleSpecOf = (command: ConsoleCommand, lists: PatternLists): CommandSpec => ({
  id: command.id,
  label: command.label,
  icon: command.icon as IconName,
  group: command.group,
  description: command.description,
  pattern: consolePatternOf(command.id, command.params),
  setup: { slots: consoleSlotsOf(command.params), lists },
  format: command.format,
});

export { consoleSpecOf };
