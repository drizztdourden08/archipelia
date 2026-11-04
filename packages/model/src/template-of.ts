/* @layer core @kind logic */
import { playerOf } from './player-of';
import type { SessionTemplate, StoredTemplate } from './session.type';

const templateOf = (stored: StoredTemplate): SessionTemplate => {
  const { direct, players, ...rest } = stored;
  const saved = { ...rest, players: players.map(playerOf) };
  if (!direct) return saved;
  const { serverId, lobbyId, admission, allowUnlisted, allowedGames, listed } = direct;
  const lobby = saved.lobby ?? (serverId ? { serverId, ...(lobbyId ? { lobbyId } : {}) } : undefined);
  const shown = listed === undefined ? {} : { listed };
  return { ...saved, ...(lobby ? { lobby } : {}), direct: { admission, allowUnlisted, allowedGames: allowedGames ?? [], ...shown } };
};

export { templateOf };
