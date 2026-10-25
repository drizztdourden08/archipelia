/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';
import { SHOWN_LENGTH } from './shown-value.constants';

const shownValue = (value: OptionValue | undefined): string => {
  const text = value === undefined ? 'nothing' : JSON.stringify(value);
  return text.length > SHOWN_LENGTH ? `${text.slice(0, SHOWN_LENGTH)}...` : text;
};

export { shownValue };
