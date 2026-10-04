/* @layer renderer-app @kind logic */
import { TEAM_MARK } from './log-checks.constants';

const senderOf = (entry: string, names: readonly string[]) => {
  const rest = entry.replace(TEAM_MARK, '');
  return names.find((name) => rest.startsWith(`${name} sent `));
};

const checksFromLog = (lines: readonly string[], names: readonly string[]): Record<string, number> => {
  const longestFirst = [...names].sort((a, b) => b.length - a.length);
  const seen = new Map<string, Set<string>>();
  lines.forEach((line) => {
    const at = line.search(TEAM_MARK);
    if (at < 0) return;
    const entry = line.slice(at);
    const sender = senderOf(entry, longestFirst);
    if (!sender) return;
    const entries = seen.get(sender) ?? new Set<string>();
    entries.add(entry);
    seen.set(sender, entries);
  });
  return Object.fromEntries([...seen].map(([name, entries]) => [name, entries.size]));
};

export { checksFromLog };
