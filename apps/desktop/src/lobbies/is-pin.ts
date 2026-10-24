/* @layer renderer-app @kind logic */
import { PIN_DIGEST } from './lobbies.constants';
import { normalizePin } from './normalize-pin';

const isPin = (value: string): boolean => PIN_DIGEST.test(normalizePin(value));

export { isPin };
