/* @layer core @kind logic */
import type { OptionDef } from '@archipelia/model';
import { outsideKeys } from './outside-keys';

const checkKeys = (def: OptionDef, keys: string[]) => {
  const bad = outsideKeys(def, keys);
  return bad.length ? `unknown: ${bad.join(', ')}` : undefined;
};

export { checkKeys };
