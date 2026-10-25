/* @layer renderer-app @kind component */
import { Box, Icon, Image, Tooltip } from '@drizztdourden08/tessera/primitives';
import { KIND_ICON, MEDIA_SIZE } from '../../GameCard.constants';
import type { GameCardMediaProps } from './GameCardMedia.type';

const GameCardMedia = ({ kind, kindLabel, art }: GameCardMediaProps) => {
  const icon = <Icon name={KIND_ICON[kind]} size={art ? 12 : 18} />;
  return (
    <Box className="game-card__media" data-art={art ? '' : undefined}>
      <Tooltip content={kindLabel}>
        {art
          ? (
            <>
              <Image src={art} alt="" width={MEDIA_SIZE} height={MEDIA_SIZE} loading="lazy" decoding="async" fit="cover" fallback={<Icon name={KIND_ICON[kind]} size={18} />} />
              <Box as="span" className="game-card__badge">{icon}</Box>
            </>
          )
          : icon}
      </Tooltip>
    </Box>
  );
};

export { GameCardMedia };
