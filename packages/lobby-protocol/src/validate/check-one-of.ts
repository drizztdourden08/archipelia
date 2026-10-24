/* @layer protocol @kind logic */
import type { Schema, SchemaProblem, Walk } from './validate.type';
import { isRecord } from './is-record';

const checkOneOf = (schema: Schema, value: unknown, path: string, walk: Walk): SchemaProblem[] => {
  if (!Array.isArray(schema.oneOf)) return [];
  const branches = schema.oneOf.filter(isRecord);
  const matching = branches.filter((branch) => walk(branch, value, path).length === 0);
  if (matching.length === 1) return [];
  return [{ path, message: `${path === '' ? 'the message' : path} does not match one of the allowed shapes` }];
};

export { checkOneOf };
