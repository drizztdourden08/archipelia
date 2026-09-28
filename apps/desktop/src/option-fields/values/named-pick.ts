/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { CUSTOM_NUMBER } from '../mapping/choice-options.constants';
import { customNumber } from './custom-number';

const namedPick = (def: OptionDef, pick: string, current: OptionValue): OptionValue =>
  (pick === CUSTOM_NUMBER ? customNumber(def, current) : def.namedValues?.[pick] ?? current);

export { namedPick };
