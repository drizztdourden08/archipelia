/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import { OPTION_TEXT } from '../LobbyMembers.constants';

const choiceLabel = (key: string, def: OptionDef | undefined): string => def?.choices?.find((choice) => choice.value === key)?.label ?? key;

const numberText = (value: number, def: OptionDef | undefined): string => {
  const named = Object.entries(def?.namedValues ?? {}).find(([, number]) => number === value);
  return named ? `${named[0]} (${value})` : String(value);
};

const scalarText = (value: unknown, def: OptionDef | undefined): string => {
  if (value === null || value === undefined) return OPTION_TEXT.notSet;
  if (typeof value === 'boolean') return value ? OPTION_TEXT.on : OPTION_TEXT.off;
  if (typeof value === 'number') return numberText(value, def);
  if (typeof value === 'string') return choiceLabel(value, def);
  return JSON.stringify(value);
};

const optionText = (value: unknown, def?: OptionDef): string => {
  if (Array.isArray(value)) return value.length === 0 ? OPTION_TEXT.none : value.map((item) => scalarText(item, def)).join(', ');
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value);
    return entries.length === 0 ? OPTION_TEXT.none : entries.map(([key, weight]) => `${choiceLabel(key, def)}: ${scalarText(weight, undefined)}`).join(', ');
  }
  return scalarText(value, def);
};

export { optionText };
