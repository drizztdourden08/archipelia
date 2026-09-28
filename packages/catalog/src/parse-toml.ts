/* @layer core @kind logic */
import type { Guard } from '@archipelia/engine';
import { parse } from 'smol-toml';

const parseToml = <T>(text: string, guard: Guard<T>, what: string): T => {
  const value: unknown = parse(text);
  if (!guard(value)) throw new Error(`${what} does not have the expected shape`);
  return value;
};

export { parseToml };
