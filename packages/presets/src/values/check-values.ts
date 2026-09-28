/* @layer core @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues, ValueProblem } from './resolve-values.type';
import { checkValue } from './check-value';

const checkValues = (schema: GameSchema, values: OptionValues): ValueProblem[] =>
  schema.options.flatMap((def) => {
    const value = values[def.key];
    if (value === undefined) return [];
    const expected = checkValue(def, value);
    return expected ? [{ key: def.key, expected }] : [];
  });

export { checkValues };
