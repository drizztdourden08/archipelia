/* @layer core @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues } from './resolve-values.type';
import { defaultValues } from './default-values';
import { knownOnly } from './known-only';

const resolveValues = (schema: GameSchema, preset: OptionValues = {}, overrides: OptionValues = {}): OptionValues => ({
  ...defaultValues(schema),
  ...knownOnly(schema, preset),
  ...knownOnly(schema, overrides),
});

export { resolveValues };
