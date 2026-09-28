/* @layer core @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';

const isNamedValue = (def: OptionDef, value: OptionValue) => typeof value === 'string' && value in (def.namedValues ?? {});

export { isNamedValue };
