/* @layer renderer-app @kind component */
import { Box, Flex, Tag, Text } from '@drizztdourden08/tessera/primitives';
import type { StageGamesProps } from './StageGames.type';

const StageGames = ({ label, values }: StageGamesProps) => (
  <Box className="lobby-stage__fact">
    <Text as="dt" variant="caption" tone="dim">{label}</Text>
    <Flex as="dd" className="lobby-stage__games" gap="2xs" align="center" wrap>
      {values.map((game) => <Tag key={game} pill>{game}</Tag>)}
    </Flex>
  </Box>
);

export { StageGames };
