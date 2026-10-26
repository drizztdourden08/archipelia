/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildFailedProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';

const BuildFailed = ({ build, message, log, onBuildStart }: BuildFailedProps) => (
  <Stack gap="md">
    <Callout tone="danger">
      <Stack gap="xs">
        <Text variant="label">{BUILD_TEXT.failedHeading}</Text>
        <Text>{message}</Text>
        {log.length > 0 && <Text tone="dim">{BUILD_TEXT.failedHelp}</Text>}
      </Stack>
    </Callout>
    {build && (
      <Flex>
        <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.tryAgain}</Button>
      </Flex>
    )}
    {log.length > 0 && <BuildLog lines={log} label={BUILD_TEXT.logLabel} />}
  </Stack>
);

export { BuildFailed };
