/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';

const withinRange = (def: OptionDef, value: OptionValue): value is number =>
  typeof value === 'number' && (!def.range || (value >= def.range.min && value <= def.range.max));

const customNumber = (def: OptionDef, current: OptionValue): number => {
  if (withinRange(def, current)) return current;
  if (withinRange(def, def.default)) return def.default;
  return def.range?.min ?? 0;
};

export { customNumber };
