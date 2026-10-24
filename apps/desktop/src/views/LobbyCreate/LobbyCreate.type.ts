/* @layer renderer-app @kind types */
import type { HostTarget, ServerEntry } from '@archipelia/model';
import type { LobbyDraft, LobbyServerView } from '../../lobbies/lobbies.type';

type RoomDefaults = { port: number; ggBaseUrl: string };

type DraftProblem = { field: 'name' | 'port' | 'machine' | 'slots'; message: string };

type RowsInput = {
  draft: LobbyDraft;
  view: LobbyServerView | null;
  machines: readonly ServerEntry[];
  defaults: RoomDefaults;
  local: boolean;
  problems: readonly DraftProblem[];
  onDraft: (draft: LobbyDraft) => void;
};

type RoomKind = HostTarget['kind'];

export type { DraftProblem, RoomDefaults, RoomKind, RowsInput };
