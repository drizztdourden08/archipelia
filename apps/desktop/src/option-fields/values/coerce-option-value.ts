/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { Loose } from './coerce-option-value.type';
import { isLoose } from './is-loose';
import { COERCE } from './coerce-option-value.constants';

const heaviest = (weights: Loose): string | undefined => {
  const ranked = Object.entries(weights)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0)
    .sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[0];
};

const scalarOf = (def: OptionDef, raw: unknown) =>
  (isLoose(raw) && def.kind !== 'counter' && def.kind !== 'dict' ? heaviest(raw) : raw);

const coerceOptionValue = (def: OptionDef, input: unknown): OptionValue | undefined => {
  const raw = scalarOf(def, input);
  if (raw === undefined || raw === null) return undefined;
  return COERCE[def.kind](def, raw);
};

export { coerceOptionValue };
