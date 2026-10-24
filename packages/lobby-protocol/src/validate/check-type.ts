/* @layer protocol @kind logic */
import type { SchemaProblem, Schema } from './validate.type';
import { isRecord } from './is-record';

const matchesType = (name: unknown, value: unknown): boolean => {
  switch (name) {
    case 'string':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'null':
      return value === null;
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isRecord(value);
    default:
      return false;
  }
};

const checkType = (schema: Schema, value: unknown, path: string): SchemaProblem[] => {
  const wanted = schema.type;
  if (wanted === undefined) return [];
  const names: unknown[] = Array.isArray(wanted) ? wanted : [wanted];
  if (names.some((name) => matchesType(name, value))) return [];
  return [{ path, message: `${path === '' ? 'the message' : path} must be of type ${names.join(' or ')}` }];
};

export { checkType };
