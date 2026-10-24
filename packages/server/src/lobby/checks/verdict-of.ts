/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import type { LobbyMember, SlotState, SlotUpload } from '@archipelia/model';
import type { SlotVerdict } from './check-slot.type';

const verdictOf = (member: LobbyMember, slot: SlotUpload, state: SlotState, failure?: Failure): SlotVerdict => ({
  memberId: member.id,
  slot: slot.name,
  from: slot.state,
  yamlSha256: slot.yamlSha256,
  ...(slot.worldSha256 === undefined ? {} : { worldSha256: slot.worldSha256 }),
  state,
  ...(failure ? { failure } : {}),
});

export { verdictOf };
