/* @layer server @kind logic */
import { ConfigProblem } from './config-problem';

const readText = (key: string, value: unknown): string => {
  if (typeof value !== 'string') throw new ConfigProblem(key, `${String(value)} is not text`);
  return value.trim();
};

export { readText };
