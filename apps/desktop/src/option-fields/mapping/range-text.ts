/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const rangeText = (def: OptionDef) => (def.range ? `${def.range.min} to ${def.range.max}` : '');

export { rangeText };
