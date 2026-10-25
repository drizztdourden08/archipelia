/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues, ValueProblem } from '@archipelia/presets';
import type { ValidationProblem } from '@drizztdourden08/tessera/composites';
import { shownValue } from './shown-value';

const problemItems = (schema: GameSchema, problems: readonly ValueProblem[], values: OptionValues, unparsed: readonly string[]): ValidationProblem[] => {
  const nameOf = (key: string) => schema.options.find((def) => def.key === key)?.displayName ?? key;
  const refused = problems.map(({ key, expected }) => ({ id: key, field: key, message: `${nameOf(key)}: expected ${expected}, found ${shownValue(values[key])}.` }));
  const broken = unparsed
    .filter((key) => !problems.some((problem) => problem.key === key))
    .map((key) => ({ id: key, field: key, message: `${nameOf(key)}: the JSON does not parse.` }));
  return [...refused, ...broken];
};

export { problemItems };
