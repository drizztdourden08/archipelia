/* @layer renderer-app @kind component */
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { artFitOf } from '../../behavior/art-fit-of';
import { initialsOf } from '../../behavior/initials-of';
import { tintOf } from '../../behavior/tint-of';
import type { ArtFit } from '../../LobbySeat.type';
import type { SeatAvatarProps } from './SeatAvatar.type';

const SeatAvatar = ({ label, art }: SeatAvatarProps) => {
  const [fit, setFit] = useState<ArtFit>(art ? 'pending' : 'off');
  const onLoad = (event: SyntheticEvent<HTMLImageElement>) => setFit(artFitOf(event.currentTarget));
  return (
    <Box as="span" className="lobby-seat__avatar" data-tint={tintOf(label)} data-art={fit === 'fits' || undefined} aria-hidden="true">
      <Text as="span" className="lobby-seat__initials">{initialsOf(label)}</Text>
      {art && fit !== 'off' && (
        <Image className="lobby-seat__art" src={art} alt="" fit="cover" placeholder="none" decoding="async" onLoad={onLoad} onError={() => setFit('off')} />
      )}
    </Box>
  );
};

export { SeatAvatar };
