/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import { choiceOptions } from '../../OptionControl';
import { SHOWN_LENGTH } from '../GameOptionsPanel.constants';

const shortText = (text: string) => (text.length > SHOWN_LENGTH ? `${text.slice(0, SHOWN_LENGTH)}...` : text);

const readOnlyValue = (def: OptionDef, value: OptionValue): boolean | string | number => {
  if (typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value !== 'string') return shortText(JSON.stringify(value));
  if (def.kind === 'choice') return choiceOptions(def).find((choice) => choice.value === value)?.label ?? value;
  return value === '' ? 'empty' : shortText(value);
};

export { readOnlyValue };
