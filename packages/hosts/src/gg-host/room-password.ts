/* @layer core @kind logic */
import { CLEARING_WORDS } from './room-password.constants';
import { shellQuote } from '../remote/shell-quote';

const passwordCommand = (password: string) => {
  if (/[\r\n]/.test(password)) throw new Error('a room password cannot contain a line break');
  if (CLEARING_WORDS.has(password.toLowerCase())) throw new Error(`"${password}" clears the password on the server, choose another one`);
  return `/option password ${shellQuote(password)}`;
};

export { passwordCommand };
