/* @layer protocol @kind logic */
import type { Schema, SchemaProblem, Walk } from './validate.type';
import { childPath } from './child-path';
import { isRecord } from './is-record';

const checkCount = (schema: Schema, value: unknown[], path: string): SchemaProblem[] => {
  const problems: SchemaProblem[] = [];
  if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
    problems.push({ path, message: `${path} must have at least ${schema.minItems} entries` });
  }
  if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
    problems.push({ path, message: `${path} must have at most ${schema.maxItems} entries` });
  }
  return problems;
};

const checkArray = (schema: Schema, value: unknown, path: string, walk: Walk): SchemaProblem[] => {
  if (!Array.isArray(value)) return [];
  const problems = checkCount(schema, value, path);
  const items = schema.items;
  if (isRecord(items)) {
    value.forEach((entry, index) => problems.push(...walk(items, entry, childPath(path, index))));
  }
  return problems;
};

export { checkArray };
