/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const rangeBounds = (def: OptionDef): { min: number; max: number } => {
  if (def.range) return def.range;
  const values = Object.values(def.namedValues ?? {});
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : { min: 0, max: 0 };
};

export { rangeBounds };
