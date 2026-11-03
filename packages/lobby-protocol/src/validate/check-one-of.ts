/* @layer protocol @kind logic */
import type { Schema, SchemaProblem, Walk } from './validate.type';
import { isRecord } from './is-record';

const requiredOnly = (branch: Schema): boolean => Object.keys(branch).length === 1 && Array.isArray(branch.required);

const checkOneOf = (schema: Schema, value: unknown, path: string, walk: Walk): SchemaProblem[] => {
  if (!Array.isArray(schema.oneOf)) return [];
  const branches = schema.oneOf.filter(isRecord);
  const matching = branches.filter((branch) => walk(branch, value, path).length === 0);
  if (matching.length === 1) return [];
  const [first] = branches;
  if (matching.length === 0 && first && branches.every(requiredOnly)) return walk(first, value, path);
  return [{ path, message: `${path === '' ? 'the message' : path} does not match one of the allowed shapes` }];
};

export { checkOneOf };
