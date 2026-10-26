/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT, MISSING_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildMissingProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';

const BuildMissing = ({ build, missing, log, onBuildStart, onOpenLink }: BuildMissingProps) => {
  const text = MISSING_TEXT[missing.tool];
  return (
    <Stack gap="md">
      <Callout tone="warning">
        <Stack gap="xs">
          <Text variant="label">{text.title}</Text>
          <Text>{text.body}</Text>
          {missing.detail && <Text mono variant="caption">{missing.detail}</Text>}
          <Link href={text.url} external navigate={onOpenLink}>{text.link}</Link>
        </Stack>
      </Callout>
      <Flex>
        <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.checkAgain}</Button>
      </Flex>
      <BuildLog lines={log} label={BUILD_TEXT.logLabel} />
    </Stack>
  );
};

export { BuildMissing };
