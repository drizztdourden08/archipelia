/* @layer core @kind logic */
import { HIDDEN_CHARACTERS, SPACE_RUNS } from './clean-name.constants';

const plainName = (text: string): string => text.replace(HIDDEN_CHARACTERS, '').replace(SPACE_RUNS, ' ').trim().normalize('NFKC');

export { plainName };
