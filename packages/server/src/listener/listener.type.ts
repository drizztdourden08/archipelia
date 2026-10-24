/* @layer core @kind types */
import type { Lobby } from '@archipelia/model';
import type { LobbyService } from '../lobby/lobby-service-api.type';

type RequestHead = { method: string; path: string; headers: Record<string, string> };

type Peer = { address: string; secure: boolean };

type ListenerTls = { key: string | Buffer; cert: string | Buffer };

type AdminDeps = {
  service: LobbyService;
  token: () => Promise<string>;
  watch: (listener: (lobby: Lobby) => void) => () => void;
  info: () => Record<string, unknown>;
  engines: () => Promise<unknown>;
};

type ListenerOptions = {
  service: LobbyService;
  admin: Omit<AdminDeps, 'service' | 'info'>;
  host: string;
  port: number;
  serverVersion: string;
  tls?: ListenerTls;
};

type RunningListener = { host: string; port: number; stop: () => Promise<void> };

export type { AdminDeps, ListenerOptions, ListenerTls, Peer, RequestHead, RunningListener };
