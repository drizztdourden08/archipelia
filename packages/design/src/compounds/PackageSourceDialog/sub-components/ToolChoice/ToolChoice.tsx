/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { TOOL_TEXT } from '../../PackageSourceDialog.constants';
import type { ToolChoiceProps } from '../../PackageSourceDialog.type';
import { ToolHow } from '../ToolHow';
import { ToolInstall } from '../ToolInstall';
import { useToolChoice } from './behavior/useToolChoice';

const ToolChoice = ({ build, tool, onToolInstall, onOpenLink }: ToolChoiceProps) => {
  const { way, setWay } = useToolChoice();
  return (
    <Stack gap="sm" as="section" aria-label={TOOL_TEXT.choose}>
      <Text variant="label">{TOOL_TEXT.choose}</Text>
      <Flex gap="sm" wrap>
        <Button variant={way === 'how' ? 'primary' : 'secondary'} icon={<Icon name="file-text" />} onClick={() => setWay('how')}>{TOOL_TEXT.how}</Button>
        <Button variant={way === 'install' ? 'primary' : 'secondary'} icon={<Icon name="download" />} onClick={() => setWay('install')}>{TOOL_TEXT.install}</Button>
      </Flex>
      {way === 'how' && <ToolHow how={tool.how} blocked={undefined} />}
      {way === 'install' && <ToolInstall build={build} tool={tool} onToolInstall={onToolInstall} onOpenLink={onOpenLink} />}
    </Stack>
  );
};

export { ToolChoice };
