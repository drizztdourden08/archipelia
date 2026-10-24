/* @layer renderer-app @kind logic */
import { PIN_SEPARATORS } from './lobbies.constants';

const normalizePin = (value: string): string => value.replace(PIN_SEPARATORS, '').toLowerCase();

export { normalizePin };
