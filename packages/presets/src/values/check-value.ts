/* @layer core @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { CHECKS } from './check-value.constants';

const checkValue = (def: OptionDef, value: OptionValue): string | undefined => CHECKS[def.kind](def, value);

export { checkValue };
