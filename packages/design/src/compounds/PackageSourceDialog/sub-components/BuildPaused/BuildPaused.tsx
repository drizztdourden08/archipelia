/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildPausedProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';

const BuildPaused = ({ build, message, log, onBuildStart }: BuildPausedProps) => (
  <Stack gap="md">
    <Callout tone="info"><Text>{message}</Text></Callout>
    <Flex>
      <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.checkAgain}</Button>
    </Flex>
    {log.length > 0 && <BuildLog lines={log} label={BUILD_TEXT.logLabel} />}
  </Stack>
);

export { BuildPaused };
