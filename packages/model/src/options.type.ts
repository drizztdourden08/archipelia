/* @layer core @kind types */
type OptionKind = 'toggle' | 'choice' | 'range' | 'named-range' | 'text' | 'set' | 'list' | 'counter' | 'dict';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type OptionValue = string | number | boolean | string[] | JsonValue[] | Record<string, number> | Record<string, JsonValue>;

type OptionChoice = { value: string; label: string };

type OptionDef = {
  key: string;
  displayName: string;
  group: string;
  kind: OptionKind;
  description: string;
  default: OptionValue;
  choices?: OptionChoice[];
  range?: { min: number; max: number };
  namedValues?: Record<string, number>;
  validKeys?: string[];
  visibility: ('simple' | 'complex')[];
  weightable: boolean;
};

type GameSchema = {
  game: string;
  worldVersion: string;
  groups: string[];
  options: OptionDef[];
  presets: Record<string, Record<string, OptionValue>>;
};

export type { GameSchema, JsonValue, OptionChoice, OptionDef, OptionKind, OptionValue };
