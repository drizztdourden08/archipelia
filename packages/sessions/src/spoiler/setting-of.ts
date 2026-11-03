/* @layer core @kind logic */
import type { SpoilerSetting } from './spoiler.type';

const settingOf = (line: string): SpoilerSetting | null => {
  const at = line.indexOf(':');
  if (at <= 0) return null;
  return { key: line.slice(0, at).trim(), value: line.slice(at + 1).trim() };
};

export { settingOf };
