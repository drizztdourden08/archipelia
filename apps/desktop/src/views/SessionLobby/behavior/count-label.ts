/* @layer renderer-app @kind logic */
import { SEAT_TEXT } from '../SessionLobby.constants';

const countLabel = (count: number): string => `${count} ${count === 1 ? SEAT_TEXT.player : SEAT_TEXT.players}`;

export { countLabel };
