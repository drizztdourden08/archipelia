/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT, MISSING_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildMissingProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';
import { ToolChoice } from '../ToolChoice';

const BuildMissing = ({ build, missing, log, tool, onBuildStart, onOpenLink, onToolInstall }: BuildMissingProps) => {
  const text = MISSING_TEXT[missing.tool];
  const offered = tool !== undefined && (tool.install !== undefined || tool.how !== '');
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
      {tool && offered && <ToolChoice build={build} tool={tool} onToolInstall={onToolInstall} onOpenLink={onOpenLink} />}
      <Flex>
        <Button variant={offered ? 'secondary' : 'primary'} icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.checkAgain}</Button>
      </Flex>
      <BuildLog lines={log} label={BUILD_TEXT.logLabel} />
    </Stack>
  );
};

export { BuildMissing };
