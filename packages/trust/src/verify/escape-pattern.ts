/* @layer core @kind logic */
import { SPECIAL } from './escape-pattern.constants';

const escapePattern = (text: string) => text.replace(SPECIAL, (char) => `\\${char}`);

export { escapePattern };
