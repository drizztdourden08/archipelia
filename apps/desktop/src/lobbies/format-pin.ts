/* @layer renderer-app @kind logic */
import { PIN_PAIR } from './lobbies.constants';
import { normalizePin } from './normalize-pin';

const formatPin = (value: string): string => (normalizePin(value).match(PIN_PAIR) ?? []).join(':').toUpperCase();

export { formatPin };
