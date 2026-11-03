/* @layer core @kind logic */
import { checkOf } from './log-checks';
import { longestFirst } from './longest-first';

const checksFromLog = (lines: readonly string[], names: readonly string[]): Record<string, number> => {
  const sorted = longestFirst(names);
  const seen = new Map<string, Set<string>>();
  lines.forEach((line) => {
    const check = checkOf(line, sorted);
    if (!check) return;
    const entries = seen.get(check.sender) ?? new Set<string>();
    entries.add(check.entry);
    seen.set(check.sender, entries);
  });
  return Object.fromEntries([...seen].map(([name, entries]) => [name, entries.size]));
};

export { checksFromLog };
