/* @layer core @kind logic */
import { COMBINING_MARKS, LOOK_ALIKES } from './clean-name.constants';
import { plainName } from './plain-name';

const nameKey = (text: string): string =>
  Array.from(plainName(text).toLowerCase().normalize('NFKD').replace(COMBINING_MARKS, ''), (letter) => LOOK_ALIKES.get(letter) ?? letter).join('');

export { nameKey };
