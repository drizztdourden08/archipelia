/* @layer renderer-app @kind logic */
import type { ConsoleParam } from '@archipelia/sessions/console-commands';
import { consoleSlotOf } from './console-slot-of';

const consolePatternOf = (id: string, params: readonly ConsoleParam[]): string =>
  [`/${id}`, ...params.map(consoleSlotOf)].join(' ');

export { consolePatternOf };
