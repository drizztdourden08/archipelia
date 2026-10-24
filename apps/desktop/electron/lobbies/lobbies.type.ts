/* @layer electron-main @kind types */
import type { SecretReader } from '@archipelia/hosts';
import type { Core, LobbyEndpoint, LobbyListen } from '@archipelia/server';
import type { LanEntry, LobbyServerOptions, LobbyServerState } from '../../src/lobbies/lobbies.type';
import type { AdminLobby, DataFiles } from '@archipelia/model';
import type { LobbyEvent } from '../../src/lobbies/lobbies.type';
import type { createLobbyServerStore } from './create-lobby-server-store';

type AdminChannel = {
  call: (type: string, params?: Record<string, unknown>) => Promise<unknown>;
  watch: (listener: (lobby: AdminLobby) => void) => () => void;
  close: () => void;
  alive: () => boolean;
};

type LinkEvent = { kind: 'text'; text: string } | { kind: 'binary'; bytes: Uint8Array } | { kind: 'close'; code: number };

type AdminLink = {
  send: (text: string) => void;
  close: () => void;
  listen: (handler: (event: LinkEvent) => void) => void;
};

type AdminMessage = Record<string, unknown> & { type: string };

type Waiter = { resolve: (message: AdminMessage) => void; reject: (error: Error) => void; timer: NodeJS.Timeout };

type RequestBook = {
  request: (body: Record<string, unknown>) => Promise<AdminMessage>;
  settle: (message: AdminMessage) => void;
  failAll: (error: Error) => void;
  alive: () => boolean;
};

type RegistryDeps = {
  local: AdminChannel;
  store: ReturnType<typeof createLobbyServerStore>;
  secrets: SecretReader;
  onLobby: (event: LobbyEvent) => void;
};

type LobbyServerDeps = {
  listen: (options: LobbyListen) => Promise<LobbyEndpoint>;
  files: DataFiles;
  automation: boolean;
  lanHost: () => string;
  version: string;
  log: (message: string) => void;
};

type ListenerCell = {
  open: (options: LobbyServerOptions) => Promise<void>;
  close: () => Promise<void>;
  state: () => LobbyServerState;
  endpoint: () => LobbyEndpoint | undefined;
  failure: () => string | undefined;
};

type LanBrowserDeps = {
  automation: boolean;
  selfId: () => string | undefined;
  onChange: (servers: LanEntry[]) => void;
  log: (message: string) => void;
};

type LobbyServicesDeps = Omit<LobbyServerDeps, 'files'> & {
  core: Core;
  domain: (id: string) => DataFiles;
  secrets: SecretReader;
  onLobby: (event: LobbyEvent) => void;
  onLan: (servers: LanEntry[]) => void;
};

type RemoteOptions = { url: string; token: string; certSha256?: string };

export type { AdminChannel, AdminLink, AdminMessage, LanBrowserDeps, LinkEvent, ListenerCell, LobbyServerDeps, LobbyServicesDeps, RegistryDeps, RemoteOptions, RequestBook, Waiter };
