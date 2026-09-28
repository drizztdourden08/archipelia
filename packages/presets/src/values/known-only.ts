/* @layer core @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { OptionValues } from './resolve-values.type';

const knownOnly =(schema: GameSchema, values: OptionValues) =>
  Object.fromEntries(Object.entries(values).filter(([key]) => schema.options.some((def) => def.key === key)));

export { knownOnly };
