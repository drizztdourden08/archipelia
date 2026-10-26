/* @layer renderer-app @kind component */
import { Box, Icon, Image } from '@drizztdourden08/tessera/primitives';
import { KIND_ICON } from '../../../GameCard/GameCard.constants';
import { ART_SIZE } from '../../GameDetails.constants';
import type { GameDetailsMediaProps } from './GameDetailsMedia.type';

const GameDetailsMedia = ({ kind, kindLabel, art }: GameDetailsMediaProps) => {
  const icon = <Icon name={KIND_ICON[kind]} size={28} label={kindLabel} />;
  return (
    <Box className="game-details__media">
      {art ? <Image src={art} alt="" width={ART_SIZE} height={ART_SIZE} fit="cover" fallback={icon} /> : icon}
    </Box>
  );
};

export { GameDetailsMedia };
