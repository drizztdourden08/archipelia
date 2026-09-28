/* @layer core @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues } from './resolve-values.type';
import { defaultValues } from './default-values';
import { knownOnly } from './known-only';

const changedValues = (schema: GameSchema, values: OptionValues): OptionValues => {
  const defaults = defaultValues(schema);
  return Object.fromEntries(
    Object.entries(knownOnly(schema, values)).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(defaults[key])),
  );
};

export { changedValues };
