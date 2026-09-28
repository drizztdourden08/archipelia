/* @layer core @kind logic */
import type { OptionDef } from '@archipelia/model';

const outOfRange = (def: OptionDef, value: number) =>
  (def.range && (value < def.range.min || value > def.range.max) ? `between ${def.range.min} and ${def.range.max}` : undefined);

export { outOfRange };
