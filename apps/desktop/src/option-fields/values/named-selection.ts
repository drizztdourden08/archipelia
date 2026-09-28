/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { CUSTOM_NUMBER } from '../mapping/choice-options.constants';

const namedSelection = (def: OptionDef, value: OptionValue): string => {
  const named = def.namedValues ?? {};
  if (typeof value === 'string' && value in named) return value;
  return Object.entries(named).find(([, count]) => count === value)?.[0] ?? CUSTOM_NUMBER;
};

export { namedSelection };
