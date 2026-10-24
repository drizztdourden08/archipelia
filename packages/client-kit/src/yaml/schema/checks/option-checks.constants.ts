/* @layer client-kit @kind config */
import type { OptionType } from '../option-schema.type';
import type { OptionCheck } from './check.type';
import { checkChoice } from './check-choice';
import { checkDict } from './check-dict';
import { checkRange } from './check-range';
import { checkText } from './check-text';
import { checkToggle } from './check-toggle';

const OPTION_CHECKS: Readonly<Record<OptionType, OptionCheck>> = {
  toggle: checkToggle,
  choice: checkChoice,
  range: checkRange,
  text: checkText,
  dict: checkDict,
};

export { OPTION_CHECKS };
