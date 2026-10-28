/* @layer core @kind logic */
import { MAX_NAME_LENGTH } from './clean-name.constants';
import { plainName } from './plain-name';

const cleanName = (text: string): string => Array.from(plainName(text)).slice(0, MAX_NAME_LENGTH).join('').trim();

export { cleanName };
