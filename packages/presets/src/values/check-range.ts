/* @layer core @kind logic */
import type { Check } from './check-value.type';
import { isNamedValue } from './is-named-value';
import { outOfRange } from './out-of-range';

const checkRange: Check = (def, value) => {
  if (isNamedValue(def, value)) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value)) return 'a whole number';
  if (def.namedValues && Object.values(def.namedValues).includes(value)) return undefined;
  return outOfRange(def, value);
};

export { checkRange };
