/* @layer tests @kind helper */
import { AUTO_STATE, CHEST_INPUT } from './session-constants';

type LobbyTarget = { host: string; port: number; code: string };

type RoomTarget = { host: string; port: number; slot: string; password: string };

type InstanceArgs = { instance: string; eventLog: string; profileName: string };

const common = ({ instance, eventLog, profileName }: InstanceArgs): string[] => [
  'worktree',
  'launch',
  instance,
  AUTO_STATE,
  '--no-focus',
  '--muted',
  `--instance=${instance}`,
  `--profile-name=${profileName}`,
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
export type { LobbyTarget, RoomTarget };
