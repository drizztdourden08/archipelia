/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildConfirmProps } from '../../PackageSourceDialog.type';

const BuildConfirm = ({ repo, short, onBuildDownload }: BuildConfirmProps) => (
  <Stack gap="md">
    <Callout tone="warning">{BUILD_TEXT.warning(repo)}</Callout>
    <Text>{BUILD_TEXT.source(repo, short)}</Text>
    <Text tone="dim">{BUILD_TEXT.how}</Text>
    <Flex>
      <Button variant="primary" icon={<Icon name="download" />} onClick={onBuildDownload}>{BUILD_TEXT.download}</Button>
    </Flex>
  </Stack>
);

export { BuildConfirm };
