/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import { BuildLog } from '../BuildLog';
import type { ToolPausedProps } from './ToolPaused.type';

const ToolPaused = ({ build, message, log, onBuildStart }: ToolPausedProps) => (
  <Stack gap="md">
    <Callout tone="info"><Text>{message}</Text></Callout>
    <Flex>
      <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.checkAgain}</Button>
    </Flex>
    {log.length > 0 && <BuildLog lines={log} label={BUILD_TEXT.logLabel} />}
  </Stack>
);

export { ToolPaused };
