/* @layer renderer-app @kind logic */
import type { LobbySeatStatus } from '@archipelia/design';
import type { SetPlayer } from '@archipelia/model';
import { SLOT_STATUS } from './slot.constants';

const slotStatusOf = (player: SetPlayer, appGame: boolean, flagged: boolean): LobbySeatStatus => {
  if (appGame && player.source.kind !== 'yaml') return SLOT_STATUS.needsFile;
  if (!player.name.trim() || !player.game) return SLOT_STATUS.needsSetup;
  return flagged ? SLOT_STATUS.needsFix : SLOT_STATUS.ready;
};

export { slotStatusOf };
