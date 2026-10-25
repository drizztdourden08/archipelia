/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { CONNECTED_ADMISSIONS } from './lobbies.constants';

const connectedCount = (lobby: AdminLobby | undefined): number =>
  lobby?.members.filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission)).length ?? 0;

export { connectedCount };
