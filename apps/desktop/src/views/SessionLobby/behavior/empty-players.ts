/* @layer renderer-app @kind logic */
import { PLAYERS_TEXT } from '../SessionLobby.constants';

const emptyPlayers = (hasGames: boolean, direct: boolean): string => {
  if (!hasGames) return PLAYERS_TEXT.noGame;
  return direct ? PLAYERS_TEXT.noneDirect : PLAYERS_TEXT.none;
};

export { emptyPlayers };
