/* @layer core @kind types */
import type { OptionValue } from '@archipelia/model';

type OptionValues = Record<string, OptionValue>;

type ValueProblem = { key: string; expected: string };

export type { OptionValues, ValueProblem };
