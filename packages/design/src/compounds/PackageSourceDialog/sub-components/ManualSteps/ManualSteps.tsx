/* @layer renderer-app @kind component */
import { Box, Button, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { ManualStepsProps } from '../../PackageSourceDialog.type';

const ManualSteps = ({ module, plan, checking, stillMissing, onCheckAgain }: ManualStepsProps) => {
  const { native, unsure, submodules, python, command } = plan;
  return (
    <Stack gap="sm" as="section" aria-label={PLAN_TEXT.manualHeading}>
      <Text variant="label">{PLAN_TEXT.manualHeading}</Text>
      <Text>{PLAN_TEXT.manualIntro}</Text>
      <Stack gap="xs" as="ol" className="package-source__list">
        {(native || unsure) && <Box as="li"><Text>{native ? PLAN_TEXT.compiler : PLAN_TEXT.compilerUnsure}</Text></Box>}
        <Box as="li">
          <Text>{PLAN_TEXT.git}</Text>
          {submodules && <Text tone="dim">{PLAN_TEXT.submodules}</Text>}
        </Box>
        <Box as="li">
          <Text>{PLAN_TEXT.python}</Text>
          <Text mono variant="caption">{python}</Text>
        </Box>
        <Box as="li"><Text>{PLAN_TEXT.install(module)}</Text></Box>
      </Stack>
      <CodeBlock code={command} language="text" copyable wrap />
      {python.includes('\\') && <Text variant="caption" tone="dim">{PLAN_TEXT.shell}</Text>}
      <Button variant="secondary" icon={<Icon name="refresh-cw" />} loading={checking} onClick={onCheckAgain}>{PLAN_TEXT.checkAgain}</Button>
      {stillMissing && <Box role="status"><Text tone="warning">{PLAN_TEXT.still(module)}</Text></Box>}
    </Stack>
  );
};

export { ManualSteps };
