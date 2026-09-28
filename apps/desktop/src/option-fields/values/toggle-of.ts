/* @layer renderer-app @kind logic */
import { FALSE_WORDS, TRUE_WORDS } from './toggle-of.constants';

const toggleOf = (raw: unknown): boolean | undefined => {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw !== 0;
  const word = String(raw).toLowerCase();
  if (TRUE_WORDS.includes(word)) return true;
  return FALSE_WORDS.includes(word) ? false : undefined;
};

export { toggleOf };
