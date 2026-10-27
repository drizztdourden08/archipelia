/* @layer renderer-app @kind logic */
import type { RunPlayer, Session } from '@archipelia/model';
import { ORIGIN_LABEL, TRUST_LABEL } from '../History.constants';
import type { PlayerRow } from '../History.type';

const rowOf = ({ slot, name, game, origin, member }: RunPlayer): PlayerRow => ({
  slot,
  name,
  game,
  origin: origin ? ORIGIN_LABEL[origin] : '',
  client: member ? member.client ?? 'Unknown client' : '',
  trust: member ? TRUST_LABEL[member.trust] : '',
});

const playerRows = (run: Session): PlayerRow[] => (run.players ?? []).map(rowOf).sort((a, b) => a.slot - b.slot);

export { playerRows };
