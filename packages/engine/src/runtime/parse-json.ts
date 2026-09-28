/* @layer core @kind logic */
import { stripBom } from '@drizztdourden08/brock-core/storage';
import type { Guard } from './parse-json.type';

const parseJson = <T>(text: string, guard: Guard<T>, what: string): T => {
  let value: unknown;
  try {
    value = JSON.parse(stripBom(text));
  } catch (err) {
    throw new Error(`${what} is not valid JSON: ${(err as Error).message}`, { cause: err });
  }
  if (!guard(value)) throw new Error(`${what} does not have the expected shape`);
  return value;
};

export { parseJson };
