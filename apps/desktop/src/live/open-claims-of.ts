/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import { CONNECTED_ADMISSIONS } from '../lobbies/lobbies.constants';

const claimsOf = (member: AdminLobbyMember): number => Math.max(1, member.slots.length);

const openClaimsOf = (members: readonly AdminLobbyMember[]): number =>
  members
    .filter((member) => member.kind === 'client' && member.openSeat === true && CONNECTED_ADMISSIONS.includes(member.admission))
    .reduce((sum, member) => sum + claimsOf(member), 0);

export { openClaimsOf };
