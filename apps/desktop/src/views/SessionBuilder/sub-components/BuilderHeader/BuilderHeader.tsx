/* @layer renderer-app @kind component */
import { Box, Flex, Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { EDITOR_TEXT } from '../../SessionBuilder.constants';
import { SessionTitle } from '../SessionTitle';
import type { BuilderHeaderProps } from './BuilderHeader.type';
import './BuilderHeader.css';

const BuilderHeader = ({ name, stored, saved, changes, tabOpen, reason, reasonId, actions, onName, children }: BuilderHeaderProps) => (
  <Stack gap="xs" className="builder-header">
    <Flex gap="sm" align="center" wrap>
      <SessionTitle name={name} stored={stored} onName={onName} />
      {tabOpen && <Tag variant="urgency" color="info">{EDITOR_TEXT.tabOpen}</Tag>}
      {changes && <Tag variant="urgency" color="warning">{changes}</Tag>}
      {saved && <Tag variant="urgency" color="success">{EDITOR_TEXT.saved}</Tag>}
      <Box className="builder-header__actions">{actions}</Box>
    </Flex>
    <Flex gap="sm" align="center" justify="between" wrap>
      {children}
      {reason && <Text id={reasonId} variant="caption" tone="warning" className="builder-header__reason">{reason}</Text>}
    </Flex>
  </Stack>
);

export { BuilderHeader };
