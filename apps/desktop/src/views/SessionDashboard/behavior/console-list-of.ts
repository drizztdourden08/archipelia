/* @layer renderer-app @kind logic */
import type { ConsoleParam } from '@archipelia/sessions/console-commands';

const consoleListOf = (param: ConsoleParam): string | undefined => {
  if (param.kind !== 'choice') return undefined;
  if (param.source !== undefined) return param.source;
  return param.options === undefined ? undefined : param.name;
};

export { consoleListOf };
