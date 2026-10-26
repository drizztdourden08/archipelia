/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { TEXT } from './sessions.constants';
import type { DirectRunDeps } from './sessions.type';
import { syncDirect } from './sync-direct';

const openDirect = async (template: SessionTemplate, deps: DirectRunDeps) => {
  const { direct } = template;
  if (!direct) throw new Error(TEXT.notDirect);
  const current = direct.lobbyId ? (await deps.list()).find((entry) => entry.id === direct.lobbyId) : undefined;
  if (current && current.phase !== 'closed') return current;
  const lobby = await deps.act(lobbyRequest.open(template, direct));
  return syncDirect({ ...template, direct: { ...direct, lobbyId: lobby.id } }, deps);
};

export { openDirect };
