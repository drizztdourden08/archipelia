/* @layer renderer-app @kind component */
import { Box, Icon, Image } from '@drizztdourden08/tessera/primitives';
import { KIND_ICON, MEDIA_SIZE } from '../../GameCard.constants';
import type { GameCardMediaProps } from './GameCardMedia.type';

const GameCardMedia = ({ kind, kindLabel, art }: GameCardMediaProps) => (
  <Box className="game-card__media">
    {art
      ? (
        <>
          <Image src={art} alt="" width={MEDIA_SIZE} height={MEDIA_SIZE} loading="lazy" decoding="async" fit="cover" fallback={<Icon name={KIND_ICON[kind]} size={18} />} />
          <Box as="span" className="game-card__badge"><Icon name={KIND_ICON[kind]} size={10} /></Box>
        </>
      )
      : <Icon name={KIND_ICON[kind]} size={18} label={kindLabel} />}
  </Box>
);

export { GameCardMedia };
