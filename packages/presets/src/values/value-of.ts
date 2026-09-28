/* @layer core @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { OptionValues } from './resolve-values.type';

const valueOf = (values: OptionValues, def: OptionDef): OptionValue => values[def.key] ?? def.default;

export { valueOf };
