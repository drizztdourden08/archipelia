/* @layer core @kind logic */
import type { OptionDef } from '@archipelia/model';

const outsideKeys = (def: OptionDef, keys: string[]) =>
  (def.validKeys?.length ? keys.filter((key) => !def.validKeys?.includes(key)) : []);

export { outsideKeys };
