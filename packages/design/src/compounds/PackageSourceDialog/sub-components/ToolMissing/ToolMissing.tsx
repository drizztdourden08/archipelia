/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Icon, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT, MISSING_TEXT } from '../../PackageSourceDialog.constants';
import { BuildLog } from '../BuildLog';
import { ToolChoice } from '../ToolChoice';
import type { ToolMissingProps } from './ToolMissing.type';

const ToolMissing = ({ stage, onBuildStart, onOpenLink, onToolInstall }: ToolMissingProps) => {
  const { build, missing, log, tool } = stage;
  const text = MISSING_TEXT[missing.tool];
  const offered = tool !== undefined && (tool.install !== undefined || tool.how !== '');
  return (
    <Stack gap="md">
      <Callout tone="warning" title={text.title}>{text.body}</Callout>
      <Stack gap="xs">
        {missing.detail && <Text mono variant="caption">{missing.detail}</Text>}
        <Link href={text.url} external navigate={onOpenLink}>{text.link}</Link>
      </Stack>
      {tool && offered && <ToolChoice build={build} tool={tool} onToolInstall={onToolInstall} onOpenLink={onOpenLink} />}
      <Flex>
        <Button variant={offered ? 'secondary' : 'primary'} icon={<Icon name="refresh-cw" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.checkAgain}</Button>
      </Flex>
      <BuildLog lines={log} label={BUILD_TEXT.logLabel} />
    </Stack>
  );
};

export { ToolMissing };
