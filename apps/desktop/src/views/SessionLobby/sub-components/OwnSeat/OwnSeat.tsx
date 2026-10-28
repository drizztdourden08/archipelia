/* @layer renderer-app @kind component */
import { SeatCard } from '@drizztdourden08/tessera/composites';
import { playerLabel } from '../../behavior/player-label';
import { seatActionsOf } from '../../behavior/seat-actions-of';
import { SEAT_TEXT } from '../../SessionLobby.constants';
import { SeatArt } from '../SeatArt';
import { SeatMeta } from '../SeatMeta';
import type { OwnSeatProps } from './OwnSeat.type';

const OwnSeat = ({ seat, presets, busy, actions }: OwnSeatProps) => {
  const { player, slot, kind } = seat;
  const name = playerLabel(player);
  if (kind === 'held') return <SeatCard state="empty" label={`${SEAT_TEXT.slot} ${slot} · ${name}`} hint={`${SEAT_TEXT.waitingFor} ${name} ${SEAT_TEXT.toConnect}`} />;
  return (
    <SeatCard
      state="filled"
      name={name}
      lead={<SeatArt game={player.game} slot={slot} />}
      meta={<SeatMeta kind={kind} player={player} presets={presets} />}
      onSelect={() => actions.edit(slot)}
      actions={seatActionsOf(seat, name, busy, actions)}
    />
  );
};

export { OwnSeat };
