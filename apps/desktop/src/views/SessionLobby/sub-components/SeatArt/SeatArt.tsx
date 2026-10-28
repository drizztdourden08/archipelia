/* @layer renderer-app @kind component */
import { Box, Icon, Image } from '@drizztdourden08/tessera/primitives';
import { useGameArt } from '../../../../hooks/useGameArt';
import { ART_SIZE, ICON_SIZE } from './SeatArt.constants';
import type { SeatArtProps } from './SeatArt.type';
import './SeatArt.css';

const SeatArt = ({ game, slot }: SeatArtProps) => {
  const art = useGameArt(game);
  const fallback = <Icon name="gamepad-2" size={ICON_SIZE} />;
  return (
    <Box className="seat-art">
      {art ? <Image src={art} alt="" width={ART_SIZE} height={ART_SIZE} loading="lazy" decoding="async" fit="cover" fallback={fallback} /> : fallback}
      {slot !== undefined && <Box as="span" className="seat-art__slot">{slot}</Box>}
    </Box>
  );
};

export { SeatArt };
