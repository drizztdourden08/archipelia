/* @layer renderer-app @kind logic */
import type { GameSchema, OptionValue } from '@archipelia/model';
import type { CoercedValues } from './coerce-preset-values.type';
import { coerceOptionValue } from './coerce-option-value';

const coercePresetValues = (schema: GameSchema, raw: Record<string, unknown>): CoercedValues => {
  const values: Record<string, OptionValue> = {};
  const skipped: string[] = [];
  Object.entries(raw).forEach(([key, input]) => {
    const def = schema.options.find((option) => option.key === key);
    const value = def ? coerceOptionValue(def, input) : undefined;
    if (value === undefined) skipped.push(key);
    else values[key] = value;
  });
  return { values, skipped };
};

export { coercePresetValues };
