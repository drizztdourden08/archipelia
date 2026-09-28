/* @layer renderer-app @kind config */
import type { OptionDef, OptionKind } from '@archipelia/model';
import { rangeText } from './range-text';

const HINTS: Partial<Record<OptionKind, (base: string, def: OptionDef) => string>> = {
  toggle: (base) => base,
  choice: (base) => base,
  range: (base, def) => `${rangeText(def)} · ${base}`,
  'named-range': (base, def) => `${rangeText(def)} or a named value · ${base}`,
};

export { HINTS };
