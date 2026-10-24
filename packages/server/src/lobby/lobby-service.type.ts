/* @layer core @kind types */
import type { SecretStore } from '@archipelia/hosts';
import type { Failure, ServerMessage } from '@archipelia/lobby-protocol';
import type { DataFiles, EngineRuntime, Lobby, LobbyOptions, Session, SessionEngine, SessionTemplate } from '@archipelia/model';
import type { LobbyRun, SessionEvent } from '@archipelia/sessions';
import type { ProofVerdict, Registry, RegistryClient, WorldVerdict } from '@archipelia/trust';

type LobbyStore = {
  load: () => Promise<Lobby[]>;
  save: (lobby: Lobby) => Promise<void>;
  hasFile: (lobbyId: string, sha256: string) => Promise<boolean>;
  readFile: (lobbyId: string, sha256: string) => Promise<Uint8Array | null>;
  writeFile: (lobbyId: string, sha256: string, bytes: Uint8Array) => Promise<void>;
  removeFile: (lobbyId: string, sha256: string) => Promise<void>;
  dir: (lobbyId: string) => string;
};

type LobbyTrust = {
  registry: () => Promise<Registry>;
  verifyProof: (sha256: string, bundle: unknown, client: RegistryClient) => Promise<ProofVerdict>;
  verifyWorld: (bytes: Uint8Array, bundle: unknown, client: RegistryClient) => Promise<WorldVerdict>;
};

type LobbyRunner = {
  run: (template: SessionTemplate, lobby: LobbyRun) => Promise<Session>;
  stop: (sessionId: string) => Promise<unknown>;
  runtimeFor: (engine: SessionEngine) => Promise<EngineRuntime | undefined>;
  output: DataFiles;
};

type OverlayWorld = { module: string; sha256: string; bytes: Uint8Array };

type OverlayInput = { lobbyId: string; dir: string; runtime: EngineRuntime; worlds: OverlayWorld[] };

type LobbyServiceDeps = {
  store: LobbyStore;
  trust: LobbyTrust;
  runner: LobbyRunner;
  overlay: (input: OverlayInput) => Promise<EngineRuntime>;
  secrets: SecretStore;
  activeEngine: () => Promise<SessionEngine | undefined>;
  serverVersion: string;
  log: (message: string) => void;
  emit: (lobby: Lobby) => void;
  now?: () => number;
  newCode?: () => string;
};

type LobbyLink = { send: (message: ServerMessage) => void; close: (code: number) => void };

type MemberRef = { lobbyId: string; memberId: string };

type Outcome<T = undefined> = { ok: true; value: T } | { ok: false; failure: Failure };

type HostSlotInput = { name: string; game: string; yaml: string; worldVersion: string };

type HostMemberInput = { displayName: string; slots: HostSlotInput[] };

type CreateLobbyInput = { name: string; engine?: SessionEngine; options?: Partial<LobbyOptions> };

type LobbyPatch = { name?: string; options?: Partial<LobbyOptions> };

type LobbyEventSink = (event: SessionEvent) => void;

export type {
  CreateLobbyInput, HostMemberInput, HostSlotInput, LobbyEventSink, LobbyLink, LobbyPatch, LobbyRunner, LobbyServiceDeps, LobbyStore, LobbyTrust,
  MemberRef, Outcome, OverlayInput, OverlayWorld,
};
