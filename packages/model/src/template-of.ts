/* @layer core @kind logic */
import type { SessionTemplate, StoredTemplate } from './session.type';

const templateOf = (stored: StoredTemplate): SessionTemplate => {
  const { direct, ...rest } = stored;
  if (!direct) return rest;
  const { serverId, lobbyId, admission, allowUnlisted } = direct;
  const lobby = rest.lobby ?? (serverId ? { serverId, ...(lobbyId ? { lobbyId } : {}) } : undefined);
  return { ...rest, ...(lobby ? { lobby } : {}), direct: { admission, allowUnlisted } };
};

export { templateOf };
