/* @layer renderer-app @kind logic */
import type { LobbyProbe } from '../../../lobbies/lobbies.type';
import { TEXT } from '../JoinSession.constants';

const probeProblem = (probe: LobbyProbe, localAp: string | undefined): string | null => {
  if (!probe.ok) return probe.message;
  if (probe.ap && localAp && probe.ap !== localAp) return TEXT.versionMismatch(probe.ap, localAp);
  if (probe.allowUnlisted === false) return TEXT.listedOnly;
  return probe.joinable ? null : TEXT.notJoinable;
};

export { probeProblem };
