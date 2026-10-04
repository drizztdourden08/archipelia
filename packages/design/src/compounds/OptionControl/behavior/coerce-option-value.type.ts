/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type Loose = Record<string, unknown>;

type Coerce = (def: OptionDef, raw: unknown) => OptionValue | undefined;

export type { Coerce, Loose };
