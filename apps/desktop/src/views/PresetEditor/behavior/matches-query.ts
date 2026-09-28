/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const matchesQuery = (def: OptionDef, needle: string) =>
  !needle || `${def.displayName} ${def.key} ${def.description}`.toLowerCase().includes(needle);

export { matchesQuery };
