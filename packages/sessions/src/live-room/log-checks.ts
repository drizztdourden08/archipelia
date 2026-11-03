/* @layer core @kind logic */
import { TEAM_MARK } from './log-checks.constants';

const senderOf = (entry: string, names: readonly string[]) => {
  const rest = entry.replace(TEAM_MARK, '');
  return names.find((name) => rest.startsWith(`${name} sent `));
};

const longestFirst = (names: readonly string[]) => [...names].sort((a, b) => b.length - a.length);

const checkOf = (line: string, sortedNames: readonly string[]) => {
  const at = line.search(TEAM_MARK);
  if (at < 0) return undefined;
  const entry = line.slice(at);
  const sender = senderOf(entry, sortedNames);
  return sender ? { sender, entry } : undefined;
};

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

export { checkOf, checksFromLog, longestFirst };
