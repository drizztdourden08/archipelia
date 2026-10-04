/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, Flex, Icon, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import type { SetupStepRowProps } from './SetupStepRow.type';
import './SetupStepRow.css';

const SetupStepRow = ({ step, index, onStep }: SetupStepRowProps) => {
  const go = useCallback(() => onStep(step.id), [onStep, step.id]);
  return (
    <Flex role="listitem" gap="sm" align="center" className="setup-step-row">
      <Icon name={step.done ? 'circle-check' : 'circle'} />
      <Stack gap="xs" className="setup-step-row__text">
        <Text variant="body">{`${index + 1}. ${step.label}`}</Text>
        <Text variant="caption" className="setup-step-row__meta">{step.meta}</Text>
      </Stack>
      <Status tone={step.done ? 'success' : 'neutral'}>{step.done ? 'Done' : 'To do'}</Status>
      <Button size="sm" variant="ghost" aria-label={`${step.action}, step ${index + 1} ${step.label}`} onClick={go}>{step.action}</Button>
    </Flex>
  );
};

export { SetupStepRow };
