/* @layer client-kit @kind types */

type OptionType = 'toggle' | 'choice' | 'range' | 'text' | 'dict';

type OptionChoice = { value: string; id: number };

type OptionRow = {
  key: string;
  type: OptionType;
  displayName?: string;
  description?: string;
  default?: unknown;
  choices?: readonly OptionChoice[];
  numeric?: boolean;
  range?: { min: number; max: number };
  locked?: boolean;
};

type OptionSchema = readonly OptionRow[];

type RowParse = { row: OptionRow | null; problems: string[] };

export type { OptionChoice, OptionRow, OptionSchema, OptionType, RowParse };
