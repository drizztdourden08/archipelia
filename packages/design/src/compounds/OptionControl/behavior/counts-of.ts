/* @layer renderer-app @kind logic */
import type { Counts } from './counts-of.type';

const countsOf = (value: unknown): Counts => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === 'number'));
};

export { countsOf };
