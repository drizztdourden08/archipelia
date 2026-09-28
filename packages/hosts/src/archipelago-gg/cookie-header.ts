/* @layer core @kind logic */
import { COOKIE } from './session-cookie.constants';

const cookieHeader = (value: string | undefined): [string, string][] =>
  (value ? [['cookie', `${COOKIE}=${value}`]] : []);

export { cookieHeader };
