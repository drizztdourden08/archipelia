/* @layer renderer-app @kind component */
import { LobbySeat } from '@archipelia/design';
import { useGameArt } from '../../../../hooks/useGameArt';
import { gameOf } from '../../behavior/game-of';
import { ownSeatView } from '../../behavior/own-seat-view';
import type { OwnSeatProps } from './OwnSeat.type';

const OwnSeat = ({ seat, context }: OwnSeatProps) => {
  const art = useGameArt(gameOf(seat.player));
  return <LobbySeat {...ownSeatView(seat, context)} art={art} />;
};

export { OwnSeat };
