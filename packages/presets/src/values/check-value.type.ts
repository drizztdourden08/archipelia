/* @layer core @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type Check = (def: OptionDef, value: OptionValue) => string | undefined;

export type { Check };
