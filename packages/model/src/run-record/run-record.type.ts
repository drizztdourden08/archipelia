/* @layer core @kind types */
import type { LobbySource } from '../lobby.type';
import type { RunMember, RunPlayer, SessionPlayer, SessionStatus, SessionTemplate } from '../session.type';

type OverrideField = { field: string; label: string; read: (template: SessionTemplate) => string };

type JoinedPlayer = { slot: number; name: string; game: string; member: RunMember };

type RunPlayersInput = { saved: SessionTemplate; hosted: readonly SessionPlayer[]; joined?: readonly JoinedPlayer[] };

type RunBuild = {
  id: string;
  createdAt: number;
  saved: SessionTemplate;
  used: SessionTemplate;
  players: RunPlayer[];
  source?: LobbySource;
  status?: SessionStatus;
};

export type { JoinedPlayer, OverrideField, RunBuild, RunPlayersInput };
