/* @layer protocol @kind logic */
import type { SchemaProblem, Schema } from './validate.type';

const checkLiteral = (schema: Schema, value: unknown, path: string): SchemaProblem[] => {
  const problems: SchemaProblem[] = [];
  if ('const' in schema && schema.const !== value) {
    problems.push({ path, message: `${path} must be ${JSON.stringify(schema.const)}` });
  }
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    problems.push({ path, message: `${path} must be one of ${schema.enum.join(', ')}` });
  }
  return problems;
};

export { checkLiteral };
