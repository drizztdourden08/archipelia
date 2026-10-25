/* @layer core @kind logic */
import type { HostTarget, LobbyRoom } from '@archipelia/model';
import { LOOPBACK_HOST } from '../../listener/listener.constants';

const localAddress = (target: HostTarget, room: Pick<LobbyRoom, 'port'>): string | null => (target.kind === 'local' ? `${LOOPBACK_HOST}:${room.port}` : null);

export { localAddress };
