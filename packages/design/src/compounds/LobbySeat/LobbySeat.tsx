/* @layer renderer-app @kind component */
import { Box, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { NONE } from './LobbySeat.constants';
import type { LobbySeatProps } from './LobbySeat.type';
import { SeatAvatar } from './sub-components/SeatAvatar';
import { SeatButtons } from './sub-components/SeatButtons';
import { SeatFoot } from './sub-components/SeatFoot';
import { SeatName } from './sub-components/SeatName';
import './LobbySeat.css';

const LobbySeat = ({ state, name, game, art, meta = NONE, status, reason, actions = NONE, tools = NONE, selected, onOpen }: LobbySeatProps) => (
  <Box as="article" className="lobby-seat" data-state={state} data-selected={selected || undefined} aria-label={name}>
    <Flex className="lobby-seat__who" gap="sm" align="start">
      {state !== 'held' && <SeatAvatar key={art ?? ''} label={game || name} art={art} />}
      <Stack className="lobby-seat__text" gap="2xs">
        <SeatName name={name} meta={meta} onOpen={onOpen} />
      </Stack>
      <SeatButtons className="lobby-seat__tools" actions={tools} iconOnly />
    </Flex>
    {reason && <Text variant="caption" className="lobby-seat__reason">{reason}</Text>}
    <SeatFoot status={status} actions={actions} />
  </Box>
);

export { LobbySeat };
