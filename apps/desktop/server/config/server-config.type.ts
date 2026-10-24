/* @layer server @kind types */
import type { NetworkMode } from '@archipelia/server/network';

type ServerConfig = {
  port: number;
  network: NetworkMode;
  loopback: boolean;
  publicLookup: boolean;
  engine: { version: string; python: string; auto: boolean };
  tls: { key: string; cert: string; selfSigned: boolean };
};

type LoadedConfig = { config: ServerConfig; file: string | null };

type ConfigSource = Readonly<Record<string, string | undefined>>;

export type { ConfigSource, LoadedConfig, ServerConfig };
