/* @layer core @kind logic */
import { TEAM_MARK } from './log-checks.constants';

const senderOf = (entry: string, names: readonly string[]) => {
  const rest = entry.replace(TEAM_MARK, '');
  return names.find((name) => rest.startsWith(`${name} sent `));
};

const checkOf = (line: string, sortedNames: readonly string[]) => {
  const at = line.search(TEAM_MARK);
  if (at < 0) return undefined;
  const entry = line.slice(at);
  const sender = senderOf(entry, sortedNames);
  return sender ? { sender, entry } : undefined;
};

export { checkOf };
