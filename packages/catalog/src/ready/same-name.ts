/* @layer core @kind logic */
import { nameKey } from './name-key';

const sameName = (a: string, b: string): boolean => nameKey(a) === nameKey(b);

export { sameName };
