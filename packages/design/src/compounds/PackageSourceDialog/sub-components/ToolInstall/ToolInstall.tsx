/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Link, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { TOOL_ELEVATION_TEXT, TOOL_TEXT } from '../../PackageSourceDialog.constants';
import type { ToolInstallProps } from '../../PackageSourceDialog.type';
import { ToolHow } from '../ToolHow';

const ToolInstall = ({ build, tool, onToolInstall, onOpenLink }: ToolInstallProps) => {
  const { install } = tool;
  if (!install) return <ToolHow how={tool.how} blocked={tool.blocked} />;
  return (
    <Stack gap="sm">
      <Text variant="label">{TOOL_TEXT.installHeading}</Text>
      <CodeBlock code={install.command} language="text" copyable wrap />
      <Stack gap="xs">
        <Text>{TOOL_TEXT.size(install.size)}</Text>
        <Text>{TOOL_TEXT.source(install.source)}</Text>
        {tool.distro && <Text variant="caption" tone="dim">{TOOL_TEXT.distro(tool.distro)}</Text>}
        {install.elevation === 'system' && <Text>{TOOL_ELEVATION_TEXT[tool.os]}</Text>}
        <Text variant="caption" tone="dim">{TOOL_TEXT.never}</Text>
        {install.restart && <Text variant="caption" tone="dim">{TOOL_TEXT.restart}</Text>}
      </Stack>
      {install.license && (
        <Flex gap="sm" wrap>
          <Text>{TOOL_TEXT.license(install.license.name)}</Text>
          <Link href={install.license.url} external navigate={onOpenLink}>{TOOL_TEXT.licenseLink}</Link>
        </Flex>
      )}
      <Flex>
        <Button variant="primary" icon={<Icon name="download" />} onClick={() => onToolInstall(build, tool)}>{TOOL_TEXT.action}</Button>
      </Flex>
    </Stack>
  );
};

export { ToolInstall };
