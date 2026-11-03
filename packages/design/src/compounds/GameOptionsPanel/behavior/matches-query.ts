/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const matchesQuery = (def: OptionDef, query: string) => {
  const needle = query.trim().toLowerCase();
  return !needle || `${def.displayName} ${def.key} ${def.description}`.toLowerCase().includes(needle);
};

export { matchesQuery };
