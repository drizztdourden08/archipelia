/* @layer core @kind logic */
import type { SessionPlayer, SessionTemplate, StoredTemplate } from './session.type';

const savedPlayerOf = (player: SessionPlayer): SessionPlayer => ({ ...player, direct: player.direct ?? false });

const templateOf = (stored: StoredTemplate): SessionTemplate => {
  const { direct, players, ...rest } = stored;
  const saved = { ...rest, players: players.map(savedPlayerOf) };
  if (!direct) return saved;
  const { serverId, lobbyId, admission, allowUnlisted } = direct;
  const lobby = saved.lobby ?? (serverId ? { serverId, ...(lobbyId ? { lobbyId } : {}) } : undefined);
  return { ...saved, ...(lobby ? { lobby } : {}), direct: { admission, allowUnlisted } };
};

export { templateOf };
