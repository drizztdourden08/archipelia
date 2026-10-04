/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { countsOf } from './counts-of';

const unusedKeys = (def: OptionDef, value: OptionValue): string[] => {
  const counts = countsOf(value);
  return (def.validKeys ?? []).filter((key) => !(key in counts));
};

export { unusedKeys };
