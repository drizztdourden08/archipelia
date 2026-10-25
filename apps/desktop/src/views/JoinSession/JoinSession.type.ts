/* @layer renderer-app @kind types */
import type { InstalledGame } from '@archipelia/model';
import type { JoinView } from '../../joins/joins.type';
import type { LanEntry, LobbyProbe } from '../../lobbies/lobbies.type';
import type { useFindSession } from './behavior/useFindSession';
import type { useJoins } from './behavior/useJoins';

type FoundServersProps = { servers: readonly LanEntry[]; looking: boolean; selected: string; onPick: (server: LanEntry) => void };

type ProbeResultProps = { probe: LobbyProbe; localAp?: string };

type PlayerFile = { fileName: string; yaml: string };

type PlayerDraft = { game: string; source: string; file: PlayerFile | null; slotName: string; displayName: string };

type JoinTarget = { address: string; code: string; ready: boolean };

type JoinPlayerProps = { target: JoinTarget; installed: readonly InstalledGame[] };

type JoinCardProps = { join: JoinView; busy: boolean; onLeave: (id: string) => void; onResume: (id: string) => void; onDismiss: (id: string) => void };

type JoinStatusProps = { join: JoinView };

type FindPanelProps = { model: ReturnType<typeof useFindSession>; localAp?: string };

type JoinedListProps = { joined: ReturnType<typeof useJoins> };

export type { FindPanelProps, FoundServersProps, JoinCardProps, JoinedListProps, JoinPlayerProps, JoinStatusProps, JoinTarget, PlayerDraft, ProbeResultProps };
