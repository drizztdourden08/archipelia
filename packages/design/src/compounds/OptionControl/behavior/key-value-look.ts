/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { KeyValueLook } from './key-value-look.type';
import { dictValueKind } from './dict-value-kind';

const keyValueLook = (def: OptionDef, value: OptionValue): KeyValueLook => {
  const keys = def.validKeys?.length ? def.validKeys : undefined;
  if (def.kind === 'counter') return { valueKind: 'count', keys, min: 0, newValue: 1 };
  const valueKind = dictValueKind(def, value) ?? 'text';
  return { valueKind, keys, newValue: valueKind === 'number' ? 0 : '' };
};

export { keyValueLook };
