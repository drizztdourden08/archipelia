/* @layer server @kind logic */
import { ConfigProblem } from './config-problem';
import { FALSE_WORDS, TRUE_WORDS } from './config.constants';

const readFlag = (key: string, value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  const word = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (TRUE_WORDS.includes(word)) return true;
  if (FALSE_WORDS.includes(word)) return false;
  throw new ConfigProblem(key, `${String(value)} is not true or false`);
};

export { readFlag };
