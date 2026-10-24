/* @layer renderer-app @kind logic */
import { inPortRange, PORT_PROBLEM } from '@archipelia/design';
import type { LobbyDraft } from '../../../lobbies/lobbies.type';
import { PROBLEM, SLOT_RANGE } from '../LobbyCreate.constants';
import type { DraftProblem } from '../LobbyCreate.type';

const draftProblems = ({ name, room, maxSlots }: LobbyDraft): DraftProblem[] => {
  const problems: DraftProblem[] = [];
  if (!name.trim()) problems.push({ field: 'name', message: PROBLEM.name });
  if (room.kind === 'local' && !inPortRange(room.port)) problems.push({ field: 'port', message: PORT_PROBLEM });
  if (room.kind === 'remote' && !room.serverId) problems.push({ field: 'machine', message: PROBLEM.machine });
  if (!Number.isInteger(maxSlots) || maxSlots < SLOT_RANGE.min || maxSlots > SLOT_RANGE.max) problems.push({ field: 'slots', message: PROBLEM.slots });
  return problems;
};

export { draftProblems };
