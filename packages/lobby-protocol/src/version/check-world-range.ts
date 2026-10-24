/* @layer protocol @kind logic */
import type { Failure } from '../protocol/protocol.type';
import type { WorldApRange } from './check-world-range.type';
import { compareApVersions } from './compare-ap-versions';

const describeRange = (range: WorldApRange): string => {
  if (range.minimumAp && range.maximumAp) return `Archipelago ${range.minimumAp} to ${range.maximumAp}`;
  if (range.minimumAp) return `Archipelago ${range.minimumAp} and newer`;
  return `Archipelago ${range.maximumAp ?? 'any version'} and older`;
};

const checkWorldRange = (lobbyAp: string, range: WorldApRange, slot?: string): Failure | null => {
  const tooOld = range.minimumAp !== undefined && compareApVersions(lobbyAp, range.minimumAp) < 0;
  const tooNew = range.maximumAp !== undefined && compareApVersions(lobbyAp, range.maximumAp) > 0;
  if (!tooOld && !tooNew) return null;
  const failure: Failure = {
    code: 'version-mismatch',
    message: `This lobby runs Archipelago ${lobbyAp}. ${range.game} ${range.worldVersion} supports ${describeRange(range)}.`,
    field: 'worlds',
    lobbyAp,
  };
  if (slot !== undefined) failure.slot = slot;
  return failure;
};

export { checkWorldRange };
