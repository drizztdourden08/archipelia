/* @layer renderer-app @kind logic */
import type { LobbyStageCode } from '@archipelia/design';
import { NETWORK_CODE_TEXT } from './stage.constants';
import type { NetworkPlace } from './stage.type';

const networkCodes = ({ host, ip, port }: NetworkPlace, room: string | null): LobbyStageCode[] => [
  ...(host ? [{ label: NETWORK_CODE_TEXT.host, value: host, copyLabel: NETWORK_CODE_TEXT.hostCopy }] : []),
  ...(ip ? [{ label: NETWORK_CODE_TEXT.ip, value: ip, copyLabel: NETWORK_CODE_TEXT.ipCopy }] : []),
  ...(port === undefined ? [] : [{ label: NETWORK_CODE_TEXT.port, value: String(port), copyLabel: NETWORK_CODE_TEXT.portCopy }]),
  ...(room ? [{ label: NETWORK_CODE_TEXT.room, value: room, copyLabel: NETWORK_CODE_TEXT.roomCopy }] : []),
];

export { networkCodes };
