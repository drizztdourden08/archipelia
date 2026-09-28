/* @layer core @kind types */
import type { OptionDef } from './options.type';

type OptionDefSeed = Partial<OptionDef> & Pick<OptionDef, 'key' | 'kind' | 'default'>;

export type { OptionDefSeed };
