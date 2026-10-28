/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { lobbyOfTab } from '../../../live/lobby-of-tab';
import type { LiveTab } from '../../../live/live.type';
import { lobbyViewOf } from '../../../live/lobby-view-of';
import { useLobbyLogStore } from '../../../stores/useLobbyLogStore';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { LobbyView } from '../../../stores/session-view-store.type';
import { EMPTY_SESSION_VIEW } from '../../../stores/session-view-store.constants';

const useLobbyViewOfTab = (tab: LiveTab | undefined, draft: SessionTemplate | undefined, lobbyPhase: boolean): LobbyView | null => {
  const lobby = useLobbyStore((state) => (tab ? lobbyOfTab(state.lobbies, tab) : undefined));
  const events = useLobbyLogStore((state) => (tab ? state.lines[tab.lobbyId] : undefined)) ?? EMPTY_SESSION_VIEW.lines;
  return useMemo(
    () => (tab && lobbyPhase ? lobbyViewOf(lobby, draft?.players ?? [], events) : null),
    [draft, events, lobby, lobbyPhase, tab],
  );
};

export { useLobbyViewOfTab };
