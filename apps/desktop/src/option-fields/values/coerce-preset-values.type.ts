/* @layer renderer-app @kind types */
import type { OptionValue } from '@archipelia/model';

type CoercedValues = { values: Record<string, OptionValue>; skipped: string[] };

export type { CoercedValues };
