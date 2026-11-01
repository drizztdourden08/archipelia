/* @layer tests @kind helper */
import { AUTO_STATE, CHEST_INPUT } from './session-constants';
import type { SessionEnv } from './session-env';

type LobbyTarget = { host: string; port: number; code: string };

type RoomTarget = { host: string; port: number; slot: string; password: string };

type InstanceArgs = { env: SessionEnv; profileDir: string; eventLog: string; profileName: string };

const common = ({ env, profileDir, eventLog, profileName }: InstanceArgs): string[] => [
  '--no-focus',
  '--muted',
  `--user-data=${profileDir}`,
  `--rom=${env.rom}`,
  `--profile-name=${profileName}`,
  `--auto-state=${AUTO_STATE}`,
  `--input-script=${CHEST_INPUT}`,
  `--event-log=${eventLog}`,
];

const lobbyJoinArgs = (instance: InstanceArgs, target: LobbyTarget): string[] => [
  ...common(instance),
  `--lobby-join=${target.host}:${target.port}:${target.code}`,
];

const apConnectArgs = (instance: InstanceArgs, target: RoomTarget): string[] => [
  ...common(instance),
  `--ap-connect=${[target.host, target.port, target.slot, ...(target.password ? [target.password] : [])].join(':')}`,
];

export { apConnectArgs, lobbyJoinArgs };
export type { InstanceArgs, LobbyTarget, RoomTarget };
