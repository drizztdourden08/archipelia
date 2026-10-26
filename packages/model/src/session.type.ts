/* @layer core @kind types */
import type { LobbyAdmission } from './lobby.type';
import type { OptionValue } from './options.type';

type ReleaseMode = 'disabled' | 'enabled' | 'auto' | 'auto-enabled' | 'goal';
type RemainingMode = 'disabled' | 'enabled' | 'goal';

type SpoilerLevel = 0 | 1 | 2 | 3;

type HostTarget =
  | { kind: 'local'; port: number }
  | { kind: 'archipelago-gg'; baseUrl?: string }
  | { kind: 'remote'; serverId: string };

type PlayerSource =
  | { kind: 'preset'; presetId: string; overrides: Record<string, OptionValue> }
  | { kind: 'yaml'; fileName: string; yaml: string };

type SessionPlayer = {
  slot: number;
  name: string;
  game: string;
  source: PlayerSource;
};

type GeneratorSettings = { spoiler: SpoilerLevel; race: boolean; progressionBalancing: boolean };

type ServerSettings = {
  passwordRef?: string;
  hintCost: number;
  releaseMode: ReleaseMode;
  collectMode: ReleaseMode;
  remainingMode: RemainingMode;
  autoShutdownMinutes: number;
};

type DirectConnection = {
  admission: LobbyAdmission;
  allowUnlisted: boolean;
};

type SessionLobby = {
  serverId: string;
  lobbyId?: string;
};

type StoredDirect = DirectConnection & Partial<SessionLobby>;

type SessionTemplate = {
  id: string;
  name: string;
  players: SessionPlayer[];
  generator: GeneratorSettings;
  server: ServerSettings;
  host: HostTarget;
  lan?: boolean;
  lobby?: SessionLobby;
  direct?: DirectConnection;
  updatedAt: number;
};

type StoredTemplate = Omit<SessionTemplate, 'direct'> & { direct?: StoredDirect };

type SessionStatus = 'draft' | 'generating' | 'starting' | 'hosting' | 'stopped' | 'failed';

type SessionOutput = { zip: string; files: string[]; spoiler?: string; generateLog: string };

type Endpoint = { host: string; port: number; roomUrl?: string };

type SessionEngine = { id: string; ap: string; python: string };

type SessionWorld = { game: string; sha256: string };

type Session = {
  id: string;
  templateId?: string;
  snapshot: SessionTemplate;
  status: SessionStatus;
  createdAt: number;
  engine?: SessionEngine;
  lobbyId?: string;
  worlds?: SessionWorld[];
  seed?: string;
  output?: SessionOutput;
  endpoint?: Endpoint;
  serverLog?: string;
  error?: string;
};

export type {
  DirectConnection, Endpoint, GeneratorSettings, HostTarget, PlayerSource, ReleaseMode, RemainingMode, ServerSettings, Session,
  SessionEngine, SessionLobby, SessionOutput, SessionPlayer, SessionStatus, SessionTemplate, SessionWorld, SpoilerLevel, StoredTemplate,
};
