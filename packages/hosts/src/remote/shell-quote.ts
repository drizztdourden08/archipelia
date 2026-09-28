/* @layer core @kind logic */
import { SAFE } from './shell-quote.constants';

const shellQuote = (value: string) => (SAFE.test(value) ? value : `'${value.replaceAll("'", `'"'"'`)}'`);

export { shellQuote };
