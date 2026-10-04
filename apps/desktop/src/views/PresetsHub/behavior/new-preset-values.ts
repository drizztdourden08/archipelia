/* @layer renderer-app @kind logic */
import type { GameSchema, OptionValue } from '@archipelia/model';
import { changedValues } from '@archipelia/presets';
import { coercePresetValues } from '@archipelia/design';

const newPresetValues = (schema: GameSchema, startFrom: string): Record<string, OptionValue> => {
  const builtIn = startFrom ? schema.presets[startFrom] : undefined;
  return builtIn ? changedValues(schema, coercePresetValues(schema, builtIn).values) : {};
};

export { newPresetValues };
