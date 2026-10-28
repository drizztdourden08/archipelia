/* @layer renderer-app @kind logic */
import { PLAYERS_TEXT } from '../SessionLobby.constants';

const subtitleOf = (direct: boolean, seats: boolean): string => {
  if (seats) return PLAYERS_TEXT.saved;
  return direct ? PLAYERS_TEXT.direct : PLAYERS_TEXT.manual;
};

export { subtitleOf };
