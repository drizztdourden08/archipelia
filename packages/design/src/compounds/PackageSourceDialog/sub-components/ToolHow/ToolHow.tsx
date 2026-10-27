/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { TOOL_BLOCKED_TEXT, TOOL_TEXT } from '../../PackageSourceDialog.constants';
import type { ToolHowProps } from '../../PackageSourceDialog.type';

const ToolHow = ({ how, blocked }: ToolHowProps) => (
  <Stack gap="sm">
    {blocked && <Callout tone="warning">{TOOL_BLOCKED_TEXT[blocked]}</Callout>}
    {how === '' ? <Text>{TOOL_TEXT.howNone}</Text> : (
      <>
        <Text>{TOOL_TEXT.howIntro}</Text>
        <CodeBlock code={how} language="text" copyable wrap />
      </>
    )}
  </Stack>
);

export { ToolHow };
