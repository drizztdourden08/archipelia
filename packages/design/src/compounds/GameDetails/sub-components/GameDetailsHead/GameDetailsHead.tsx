/* @layer renderer-app @kind component */
import { Flex, Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { GAME_STATUS } from '../../../GameCard/GameCard.constants';
import { VerifiedTag } from '../../../GameCard';
import { GameDetailsMedia } from '../GameDetailsMedia';
import type { GameDetailsHeadProps } from './GameDetailsHead.type';

const GameDetailsHead = ({ kind, kindLabel, art, version, verified, status }: GameDetailsHeadProps) => (
  <Flex align="center" gap="md">
    <GameDetailsMedia kind={kind} kindLabel={kindLabel} art={art} />
    <Stack gap="xs">
      <Text>{kindLabel}</Text>
      <Flex align="center" gap="sm" wrap>
        {version && <Text variant="caption" mono numeric>{version}</Text>}
        {verified && <VerifiedTag />}
        {status && <Tag>{GAME_STATUS[status].label}</Tag>}
      </Flex>
    </Stack>
  </Flex>
);

export { GameDetailsHead };
