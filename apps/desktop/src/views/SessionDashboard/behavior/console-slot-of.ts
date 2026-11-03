/* @layer renderer-app @kind logic */
import type { ConsoleParam } from '@archipelia/sessions/console-commands';
import { consoleListOf } from './console-list-of';

const rangeOf = (param: ConsoleParam): string => (param.min === undefined || param.max === undefined ? '' : ` ${param.min}..${param.max}`);

const consoleSlotOf = (param: ConsoleParam): string => {
  const list = consoleListOf(param);
  if (list !== undefined) return `{${param.name}:choice @${list}}`;
  if (param.kind === 'number') return `{${param.name}:number${rangeOf(param)}}`;
  return `{${param.name}:text}`;
};

export { consoleSlotOf };
