/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { customNumber } from './custom-number';

const numberShown = (def: OptionDef, value: OptionValue): number =>
  (typeof value === 'number' ? value : def.namedValues?.[String(value)] ?? customNumber(def, value));

export { numberShown };
