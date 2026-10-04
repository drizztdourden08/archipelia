/* @layer renderer-app @kind types */
type PlayerStatus = 'unknown' | 'offline' | 'connected' | 'ready' | 'playing' | 'goal';

type RoomPlayer = { team: number; slot: number; name: string; game: string };

type WatchedChecks = { team: number; slot: number; checked: number; total: number };

type ProtocolHint = {
  receiving_player: number;
  finding_player: number;
  location: number;
  item: number;
  found: boolean;
  entrance: string;
  status?: number;
};

type HintLookup = {
  playerName: (slot: number) => string;
  gameOf: (slot: number) => string;
  itemName: (game: string, id: number) => string;
  locationName: (game: string, id: number) => string;
};

type HintState = 'priority' | 'open' | 'no priority' | 'avoid' | 'found';

type HintView = {
  key: string;
  item: string;
  receiver: string;
  finder: string;
  location: string;
  entrance: string;
  state: HintState;
};

type PlayerView = {
  slot: number;
  name: string;
  game: string;
  status: PlayerStatus;
  checked: number | null;
  total: number | null;
};

type LiveRoomPhase = 'idle' | 'connecting' | 'live' | 'password' | 'failed' | 'closed';

type LiveRoomTarget = { sessionId: string; urls: string[]; slotName: string };

export type {
  HintLookup, HintState, HintView, LiveRoomPhase, LiveRoomTarget, PlayerStatus, PlayerView, ProtocolHint, RoomPlayer,
  WatchedChecks,
};
