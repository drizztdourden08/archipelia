/* @layer renderer-app @kind logic */
import type { PatternSlotConfigs } from '@drizztdourden08/tessera/composites';
import type { ConsoleParam } from '@archipelia/sessions/console-commands';

const consoleSlotsOf = (params: readonly ConsoleParam[]): PatternSlotConfigs =>
  Object.fromEntries(params.map((param) => [param.name, { label: param.label, placeholder: param.placeholder ?? param.label }]));

export { consoleSlotsOf };
