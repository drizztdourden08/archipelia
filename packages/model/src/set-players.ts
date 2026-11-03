/* @layer core @kind logic */
import { isSet } from './is-set';
import type { SessionPlayer, SetPlayer } from './session.type';

const setPlayers = (players: readonly SessionPlayer[]): SetPlayer[] => players.filter(isSet);

export { setPlayers };
