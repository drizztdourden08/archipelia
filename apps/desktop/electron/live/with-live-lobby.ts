/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../src/live/live.type';
import { withoutLobbyId } from './without-lobby-id';

const withLiveLobby = (templates: readonly SessionTemplate[], tabs: readonly LiveTab[]): SessionTemplate[] =>
  templates.map((template) => {
    const tab = tabs.find((entry) => entry.sessionId === template.id);
    const plain = withoutLobbyId(template);
    return tab ? { ...plain, lobby: { serverId: tab.serverId, lobbyId: tab.lobbyId } } : plain;
  });

export { withLiveLobby };
