/* @layer core @kind logic */
import { CAPITAL_LOOK_ALIKES, COMBINING_MARKS, LOOK_ALIKES } from './clean-name.constants';
import { plainName } from './plain-name';

const nameKey = (text: string): string =>
  Array.from(Array.from(plainName(text), (letter) => CAPITAL_LOOK_ALIKES.get(letter) ?? letter).join('').toLowerCase().normalize('NFKD').replace(COMBINING_MARKS, ''), (letter) => LOOK_ALIKES.get(letter) ?? letter).join('');

export { nameKey };
