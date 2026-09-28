/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import './PlayerRowHeader.css';

const PlayerRowHeader = () => (
  <Box className="player-row player-row--head">
    <Text variant="caption">#</Text>
    <Text variant="caption">Name</Text>
    <Text variant="caption">Game</Text>
    <Text variant="caption">Preset</Text>
    <Text variant="caption">Overrides</Text>
    <Text variant="caption" />
  </Box>
);

export { PlayerRowHeader };
