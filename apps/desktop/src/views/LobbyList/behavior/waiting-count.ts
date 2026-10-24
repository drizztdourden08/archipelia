/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';

const waitingCount = (lobby: AdminLobby): number => lobby.members.filter((member) => member.admission === 'pending').length;

export { waitingCount };
