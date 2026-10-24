/* @layer protocol @kind logic */
import type { Schema, SchemaProblem, Walk } from './validate.type';
import { childPath } from './child-path';
import { isRecord } from './is-record';

const missingKeys = (required: unknown, value: Record<string, unknown>, path: string): SchemaProblem[] => {
  if (!Array.isArray(required)) return [];
  return required
    .filter((key): key is string => typeof key === 'string' && value[key] === undefined)
    .map((key) => ({ path: childPath(path, key), message: `${childPath(path, key)} is missing` }));
};

const checkProperties = (
  properties: unknown,
  value: Record<string, unknown>,
  path: string,
  walk: Walk,
): SchemaProblem[] => {
  if (!isRecord(properties)) return [];
  const problems: SchemaProblem[] = [];
  for (const [key, node] of Object.entries(properties)) {
    const child = value[key];
    if (child !== undefined && isRecord(node)) problems.push(...walk(node, child, childPath(path, key)));
  }
  return problems;
};

const checkObject = (schema: Schema, value: unknown, path: string, walk: Walk): SchemaProblem[] => {
  if (!isRecord(value)) return [];
  return [...missingKeys(schema.required, value, path), ...checkProperties(schema.properties, value, path, walk)];
};

export { checkObject };
