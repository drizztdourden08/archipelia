/* @layer renderer-app @kind logic */
import { LOOPBACK } from '../../../lobbies/lobbies.constants';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';

const sameComputer = (status: LobbyServerStatus): string | null => (status.port === undefined ? null : `${LOOPBACK}:${status.port}`);

export { sameComputer };
