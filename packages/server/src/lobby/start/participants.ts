/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { Participant } from './start.type';

const participants = (lobby: Lobby): Participant[] =>
  lobby.members.filter((member) => member.admission === 'approved').flatMap((member) =>
    member.slots.filter((slot) => slot.state === 'ok').map((slot) => ({ member, slot })));

export { participants };
