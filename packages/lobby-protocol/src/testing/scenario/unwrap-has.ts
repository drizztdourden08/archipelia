/* @layer testing @kind logic */
import type { JsonValue } from './scenario.type';
import { isHasClause } from './is-has-clause';

const unwrapHas = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) return value.map((entry) => unwrapHas(isHasClause(entry) ? entry.$has : entry));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, unwrapHas(entry)]));
  }
  return value;
};

export { unwrapHas };
