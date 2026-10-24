/* @layer protocol @kind logic */
import type { SchemaProblem, Schema } from './validate.type';

const checkNumber = (schema: Schema, value: unknown, path: string): SchemaProblem[] => {
  if (typeof value !== 'number') return [];
  const problems: SchemaProblem[] = [];
  if (typeof schema.minimum === 'number' && value < schema.minimum) {
    problems.push({ path, message: `${path} must be at least ${schema.minimum}` });
  }
  if (typeof schema.maximum === 'number' && value > schema.maximum) {
    problems.push({ path, message: `${path} must be at most ${schema.maximum}` });
  }
  return problems;
};

export { checkNumber };
