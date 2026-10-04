/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { titleCase } from './title-case';
import { HINTS } from './option-hint.constants';

const choiceLabel = (def: OptionDef, value: OptionValue) =>
  titleCase(def.choices?.find((choice) => choice.value === value)?.label ?? String(value));

const namedRangeLabel = (def: OptionDef, value: number) => {
  const name = Object.entries(def.namedValues ?? {}).find(([, count]) => count === value)?.[0];
  return name ? `${titleCase(name)} (${value})` : String(value);
};

const valueLabel = (def: OptionDef, value: OptionValue): string => {
  if (typeof value === 'boolean') return value ? 'on' : 'off';
  if (def.kind === 'choice') return choiceLabel(def, value);
  if (def.kind === 'named-range' && typeof value === 'number') return namedRangeLabel(def, value);
  return typeof value === 'object' ? '' : String(value);
};

const hintOf = (def: OptionDef, reference: OptionValue = def.default, prefix = 'default'): string | undefined =>
  HINTS[def.kind]?.(`${prefix} ${valueLabel(def, reference)}`, def);

export { hintOf };
