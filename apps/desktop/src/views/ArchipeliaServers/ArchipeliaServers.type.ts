/* @layer renderer-app @kind types */
import type { LobbyServerEntry } from '@archipelia/model';
import type { LanEntry, LobbyServerStatus, LobbyServerTest } from '../../lobbies/lobbies.type';
import type { useRemoteServers } from './behavior/useRemoteServers';

type ServerDraft = { label: string; url: string; token: string; pin: string };

type DraftProblem = { field: 'label' | 'url' | 'token' | 'pin'; message: string };

type LanMatch = 'same' | 'different' | 'unknown';

type LanRow = { id: string; name: string; address: string; ap: string; open: boolean; self: boolean; match: LanMatch };

type LocalPanelProps = { status: LobbyServerStatus | null; busy: boolean; error: string | null; onApply: (patch: Partial<LobbyServerStatus['options']>) => void; onRefresh: () => void };

type RemotePanelProps = { entry: LobbyServerEntry; model: ReturnType<typeof useRemoteServers>; test: LobbyServerTest | undefined };

type LanListProps = { servers: LanEntry[]; ap: string | undefined };

export type { DraftProblem, LanListProps, LanMatch, LanRow, LocalPanelProps, RemotePanelProps, ServerDraft };
