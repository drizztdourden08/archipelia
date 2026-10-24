/* @layer protocol @kind logic */
import type { SchemaProblem, Schema } from './validate.type';

const checkString = (schema: Schema, value: unknown, path: string): SchemaProblem[] => {
  if (typeof value !== 'string') return [];
  const problems: SchemaProblem[] = [];
  if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
    problems.push({ path, message: `${path} must have at least ${schema.minLength} characters` });
  }
  if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
    problems.push({ path, message: `${path} must have at most ${schema.maxLength} characters` });
  }
  if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern, 'u').test(value)) {
    problems.push({ path, message: `${path} is malformed` });
  }
  return problems;
};

export { checkString };
