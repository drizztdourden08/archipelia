/* @layer renderer-app @kind types */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { HostLogLine } from '@archipelia/hosts';
import type { Session } from '@archipelia/model';
import type { TabPhase } from '../live/tab-phase.type';
import type { LobbyServerStatus } from '../lobbies/lobbies.type';

type SeatState = 'ready' | 'held' | 'checking' | 'refused';

type LobbySeat = { key: string; name: string; game: string | null; state: SeatState; meta: string };

type LobbyPending = { id: string; name: string; client: string };

type LobbyView = { seats: LobbySeat[]; pending: LobbyPending[]; events: readonly HostLogLine[] };

type NetworkView = { status: LobbyServerStatus | null; names: Record<string, string>; facts: FactsPanelFact[] };

type SessionView = {
  session: Session | null;
  lines: readonly HostLogLine[];
  loaded: boolean;
  failed: boolean;
  phase: TabPhase | null;
  lobby: LobbyView | null;
  network: NetworkView;
};

type SessionViewState = SessionView & { show: (view: SessionView) => void };

export type { LobbyPending, LobbySeat, LobbyView, NetworkView, SeatState, SessionView, SessionViewState };
