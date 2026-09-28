/* @layer core @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues } from './resolve-values.type';

const defaultValues = (schema: GameSchema): OptionValues =>
  Object.fromEntries(schema.options.map((def) => [def.key, def.default]));

export { defaultValues };
