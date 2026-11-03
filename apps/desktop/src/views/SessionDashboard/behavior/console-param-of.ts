/* @layer renderer-app @kind logic */
import type { CommandParam } from '@drizztdourden08/tessera/composites';
import { SERVER_OPTIONS } from '@archipelia/sessions/console-commands';
import type { ConsoleParam } from '@archipelia/sessions/console-commands';

const optionsOf = (param: ConsoleParam, players: readonly string[]): readonly string[] => {
  if (param.options) return param.options;
  if (param.source === 'players') return players;
  if (param.source === 'options') return SERVER_OPTIONS.map((option) => option.name);
  return [];
};

const consoleParamOf = (param: ConsoleParam, players: readonly string[]): CommandParam => {
  const options = optionsOf(param, players);
  const choice = param.kind === 'choice' && options.length > 0;
  return {
    name: param.name,
    label: param.label,
    kind: param.kind === 'choice' && !choice ? 'text' : param.kind,
    ...(choice ? { options } : {}),
    ...(param.optional ? { optional: true } : {}),
  };
};

export { consoleParamOf };
