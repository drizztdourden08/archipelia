/* @layer testing @kind logic */
import type { JsonValue } from './scenario.type';
import { placeholderName } from './placeholder-name';

const resolvePlaceholders = (value: JsonValue, lookup: (name: string) => JsonValue): JsonValue => {
  const name = placeholderName(value);
  if (name !== null) return lookup(name);
  if (Array.isArray(value)) return value.map((entry) => resolvePlaceholders(entry, lookup));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolvePlaceholders(entry, lookup)]));
  }
  return value;
};

export { resolvePlaceholders };
