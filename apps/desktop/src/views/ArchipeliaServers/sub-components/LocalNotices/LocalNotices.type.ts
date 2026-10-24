/* @layer renderer-app @kind types */
import type { LobbyServerStatus } from '../../../../lobbies/lobbies.type';

type LocalNoticesProps = { status: LobbyServerStatus | null; error: string | null };

export type { LocalNoticesProps };
