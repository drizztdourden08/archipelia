/* @layer renderer-app @kind logic */
import type { RunPlayer, RunSlotEnd, Session } from '@archipelia/model';
import { ORIGIN_LABEL, TRUST_LABEL } from '../History.constants';
import type { PlayerRow } from '../History.type';
import { slotEndRow } from './slot-end-row';

const rowOf = ({ slot, name, game, origin, member }: RunPlayer, end: RunSlotEnd | undefined): PlayerRow => ({
  slot,
  name,
  game,
  origin: origin ? ORIGIN_LABEL[origin] : '',
  client: member ? member.client ?? 'Unknown client' : '',
  trust: member ? TRUST_LABEL[member.trust] : '',
  ...slotEndRow(end),
});

const playerRows = (run: Session): PlayerRow[] => (run.players ?? []).map((player) => rowOf(player, run.end?.slots.find((end) => end.slot === player.slot))).sort((a, b) => a.slot - b.slot);

export { playerRows };
