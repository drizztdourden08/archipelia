/* @layer core @kind logic */
import { ERROR_LINE, NOISE, NO_OUTPUT } from './failure-of.constants';

const failureOf = (lines: string[]) => {
  const meaningful = lines.filter((line) => !NOISE.test(line));
  const lastError = meaningful.filter((line) => ERROR_LINE.test(line)).at(-1)?.trim();
  const tail = meaningful.slice(-3).join(' ').trim();
  return lastError ?? (tail.length > 0 ? tail : NO_OUTPUT);
};

export { failureOf };
