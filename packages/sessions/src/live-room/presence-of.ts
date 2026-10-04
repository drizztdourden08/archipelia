/* @layer core @kind logic */
import { onlineFromLog } from './online-from-log';

const presenceOf = (lines: readonly string[], names: readonly string[]): Record<string, boolean> => {
  if (lines.length === 0) return {};
  const unseen = Object.fromEntries(names.map((name) => [name, false]));
  return { ...unseen, ...onlineFromLog(lines) };
};

export { presenceOf };
