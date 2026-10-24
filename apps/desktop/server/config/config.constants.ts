/* @layer server @kind config */
import type { ServerConfig } from './server-config.type';

const DEFAULT_CONFIG: ServerConfig = {
  port: 38290,
  network: 'lan',
  loopback: false,
  publicLookup: true,
  engine: { version: '', python: '', auto: true },
  tls: { key: '', cert: '', selfSigned: true },
};

const CONFIG_ENV = {
  file: 'ARCHIPELIA_CONFIG',
  port: 'ARCHIPELIA_PORT',
  network: 'ARCHIPELIA_NETWORK',
  loopback: 'ARCHIPELIA_LOOPBACK',
  publicLookup: 'ARCHIPELIA_PUBLIC_LOOKUP',
  engine: 'ARCHIPELIA_ENGINE',
  python: 'ARCHIPELIA_PYTHON',
  engineAuto: 'ARCHIPELIA_ENGINE_AUTO',
  tlsKey: 'ARCHIPELIA_TLS_KEY',
  tlsCert: 'ARCHIPELIA_TLS_CERT',
  tlsSelfSigned: 'ARCHIPELIA_TLS_SELF_SIGNED',
} as const;

const CONFIG_FLAG = '--config=';
const CONFIG_FILE_NAME = 'server.toml';
const SYSTEM_CONFIG_FILE = '/etc/archipelia/server.toml';
const MAX_PORT = 65535;
const TRUE_WORDS = ['1', 'true', 'yes', 'on'];
const FALSE_WORDS = ['0', 'false', 'no', 'off'];

export { CONFIG_ENV, CONFIG_FILE_NAME, CONFIG_FLAG, DEFAULT_CONFIG, FALSE_WORDS, MAX_PORT, SYSTEM_CONFIG_FILE, TRUE_WORDS };
