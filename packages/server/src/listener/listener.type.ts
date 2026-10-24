/* @layer core @kind types */
import type { Lobby } from '@archipelia/model';
import type { RateLimiter } from '../lobby/link/link.type';
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

type AcceptDeps = { admin: AdminDeps; limiter: RateLimiter; log: (message: string) => void; upgraded: () => void };

type AdminConnectionDeps = AdminDeps & { limiter: RateLimiter };

type ListenerOptions = {
  service: LobbyService;
  admin: Omit<AdminDeps, 'service' | 'info'>;
  host: string;
  port: number;
  serverVersion: string;
  tls?: ListenerTls;
  log?: (message: string) => void;
  upgradeTimeoutMs?: number;
};

type RunningListener = { host: string; port: number; secure: boolean; stop: () => Promise<void> };

export type { AcceptDeps, AdminConnectionDeps, AdminDeps, ListenerOptions, ListenerTls, Peer, RequestHead, RunningListener };
