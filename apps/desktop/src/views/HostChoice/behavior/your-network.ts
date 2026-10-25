/* @layer renderer-app @kind logic */
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';

const yourNetwork = (status: LobbyServerStatus): string | null => (status.port === undefined ? null : `${status.lanAddress}:${status.port}`);

export { yourNetwork };
