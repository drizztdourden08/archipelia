/* @layer tests @kind helper */
import { AUTO_STATE, CHEST_INPUT } from './session-constants';
import type { SessionEnv } from './session-env';

type LobbyTarget = { host: string; port: number; code: string };

type RoomTarget = { host: string; port: number; slot: string; password: string };

// TODO(rotp lead): confirm the flag that gives an instance its own profile; --user-data is the Brock convention.
const common = (env: SessionEnv, profileDir: string, eventLog: string): string[] => [
  '--no-focus',
  '--muted',
  `--user-data=${profileDir}`,
  '--rom', env.rom,
  '--auto-state', AUTO_STATE,
  '--input-script', CHEST_INPUT,
  `--event-log=${eventLog}`,
];

const lobbyJoinArgs = (env: SessionEnv, profileDir: string, eventLog: string, yaml: string, target: LobbyTarget): string[] => [
  ...common(env, profileDir, eventLog),
  env.yamlFlag, yaml,
  `--lobby-join=${target.host}:${target.port}:${target.code}`,
];

const apConnectArgs = (env: SessionEnv, profileDir: string, eventLog: string, target: RoomTarget): string[] => [
  ...common(env, profileDir, eventLog),
  `--ap-connect=${[target.host, target.port, target.slot, ...(target.password ? [target.password] : [])].join(':')}`,
];

export { apConnectArgs, lobbyJoinArgs };
export type { LobbyTarget, RoomTarget };
