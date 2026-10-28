/* @layer renderer-app @kind types */
import type { SessionPlayer } from '@archipelia/model';

type TabDraftState = {
  players: Record<string, SessionPlayer[]>;
  setPlayers: (tabId: string, players: SessionPlayer[]) => void;
  clear: (tabId: string) => void;
};

export type { TabDraftState };
