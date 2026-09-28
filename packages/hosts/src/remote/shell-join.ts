/* @layer core @kind logic */
import { shellQuote } from './shell-quote';

const shellJoin = (words: string[]) => words.map(shellQuote).join(' ');

export { shellJoin };
