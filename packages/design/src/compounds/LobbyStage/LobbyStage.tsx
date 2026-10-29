/* @layer renderer-app @kind component */
import { Box, Flex, Stack, Title } from '@drizztdourden08/tessera/primitives';
import type { LobbyStageProps } from './LobbyStage.type';
import { StageCode } from './sub-components/StageCode';
import { StageConfig } from './sub-components/StageConfig';
import './LobbyStage.css';

const LobbyStage = ({ title, chips, actions, code, note, config, children }: LobbyStageProps) => (
  <Box as="section" className="lobby-stage" aria-label={title}>
    <Stack as="header" className="lobby-stage__head" gap="sm">
      <Flex className="lobby-stage__line" gap="sm" align="center">
        <Title level={2} className="lobby-stage__title">{title}</Title>
        <Flex className="lobby-stage__chips" gap="xs" align="center" wrap>{chips}</Flex>
        <Flex className="lobby-stage__actions" gap="sm" align="center">{actions}</Flex>
      </Flex>
      <Flex className="lobby-stage__line" gap="sm" align="center" wrap>
        {code && <StageCode {...code} />}
        <Box className="lobby-stage__note">{note}</Box>
      </Flex>
    </Stack>
    <Stack className="lobby-stage__body" gap="md">{children}</Stack>
    {config && <StageConfig {...config} />}
  </Box>
);

export { LobbyStage };
