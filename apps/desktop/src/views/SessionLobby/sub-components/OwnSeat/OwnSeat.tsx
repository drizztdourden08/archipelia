/* @layer renderer-app @kind component */
import { LobbySeat } from '@archipelia/design';
import { useGameArt } from '../../../../hooks/useGameArt';
import { ownSeatView } from '../../behavior/own-seat-view';
import type { OwnSeatProps } from './OwnSeat.type';

const OwnSeat = ({ seat, context }: OwnSeatProps) => {
  const art = useGameArt(seat.kind === 'held' ? undefined : seat.player.game);
  return <LobbySeat {...ownSeatView(seat, context)} art={art} />;
};

export { OwnSeat };
