/* @layer renderer-app @kind component */
import { Inline, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { seatDetail } from '../../behavior/seat-detail';
import { SEAT_TEXT } from '../../SessionLobby.constants';
import type { SeatMetaProps } from './SeatMeta.type';

const SeatMeta = ({ kind, player, presets }: SeatMetaProps) => {
  const added = kind === 'added';
  return (
    <Inline gap="xs" align="center">
      <Tag color={added ? 'secondary' : 'neutral'} title={added ? SEAT_TEXT.addedTitle : SEAT_TEXT.savedTitle}>{added ? SEAT_TEXT.added : SEAT_TEXT.saved}</Tag>
      <Text as="span" variant="caption" tone="dim">{seatDetail(player, presets)}</Text>
    </Inline>
  );
};

export { SeatMeta };
