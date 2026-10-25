/* @layer renderer-app @kind types */
import type { LanEntry, LobbyProbe } from '../../lobbies/lobbies.type';

type FoundServersProps = { servers: readonly LanEntry[]; looking: boolean; selected: string; onPick: (server: LanEntry) => void };

type ProbeResultProps = { probe: LobbyProbe };

export type { FoundServersProps, ProbeResultProps };
