/* @layer renderer-app @kind component */
import { Box, Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { PlanStepProps } from '../../PackageSourceDialog.type';
import { ManualSteps } from '../ManualSteps';

const PlanStep = ({ module, plan, checking, stillMissing, installing, onInstallFromPypi, onCheckAgain }: PlanStepProps) => {
  const { pin, pypi, owner, repo } = plan;
  const short = pin.sha.slice(0, 7);
  const version = pin.kind === 'tag' ? `${pin.ref} (${short})` : short;
  const date = pin.date ? new Date(pin.date).toLocaleDateString() : undefined;
  return (
    <Stack gap="lg">
      <Text>{PLAN_TEXT.noBuild(version, date)}</Text>
      {pypi?.linked && (
        <Stack gap="sm" as="section" aria-label={pypi.name}>
          <Text>{PLAN_TEXT.pypiLinked(`${owner}/${repo}`, pypi.name)}</Text>
          <Flex>
            <Button variant="primary" icon={<Icon name="download" />} loading={installing} onClick={onInstallFromPypi}>{PLAN_TEXT.pypiAction}</Button>
          </Flex>
        </Stack>
      )}
      {pypi && !pypi.linked && <Text tone="dim">{PLAN_TEXT.pypiUnlinked(pypi.name)}</Text>}
      <Stack gap="xs">
        <Flex>
          <Button variant="secondary" disabled icon={<Icon name="wrench" />}>{PLAN_TEXT.build}</Button>
        </Flex>
        <Box role="note"><Text variant="caption" tone="dim">{PLAN_TEXT.buildSoon}</Text></Box>
      </Stack>
      <ManualSteps module={module} plan={plan} checking={checking} stillMissing={stillMissing} onCheckAgain={onCheckAgain} />
    </Stack>
  );
};

export { PlanStep };
