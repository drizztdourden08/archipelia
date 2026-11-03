/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import { FALLBACK_TAB } from '../GameOptionsPanel.constants';

const tabIdsOf = (schema: GameSchema): string[] => {
  if (schema.groups.length === 0) return [FALLBACK_TAB];
  const used = new Set(schema.options.map((def) => def.group));
  const ordered = [...schema.groups, ...schema.options.map((def) => def.group)].filter((id, at, all) => all.indexOf(id) === at);
  const tabs = ordered.filter((id) => used.has(id));
  return tabs.length ? tabs : [FALLBACK_TAB];
};

export { tabIdsOf };
