/* @layer renderer-app @kind component */
import { useCallback, useId, useMemo, useState } from 'react';
import { Box, Button, Flex, Stack, Status, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { descriptionPreview } from './behavior/description-preview';
import { fieldControl } from './behavior/field-control';
import type { OptionFieldProps } from './OptionField.type';
import './OptionField.css';

const OptionField = ({ label, description, hint, changed, advanced, problem, onReset, children }: OptionFieldProps) => {
  const [expanded, setExpanded] = useState(false);
  const labelId = useId();
  const { preview, long } = useMemo(() => descriptionPreview(description), [description]);
  const handleToggle = useCallback(() => setExpanded((open) => !open), []);
  const toggleText = expanded ? 'Less' : 'More';
  return (
    <Box className={`option-field${problem ? ' option-field--problem' : ''}`} role="group" aria-label={label}>
      <Stack gap="xs" className="option-field__about">
        <Flex gap="sm" align="center" wrap>
          <Text variant="label" id={labelId}>{label}</Text>
          {advanced && <Tag>advanced</Tag>}
        </Flex>
        {description && <Text variant="caption" className="option-field__description">{expanded ? description.trim() : preview}</Text>}
        {long && (
          <Box>
            <Button size="sm" variant="ghost" onClick={handleToggle} aria-expanded={expanded} aria-label={`${toggleText} about ${label}`}>{toggleText}</Button>
          </Box>
        )}
        {hint && <Text variant="caption" className="option-field__hint">{hint}</Text>}
      </Stack>
      <Stack gap="xs" className="option-field__control">
        <Flex gap="sm" align="center" justify="end">
          {changed && <Status tone="warning">changed</Status>}
          <Button size="sm" variant="tertiary" aria-label={`Reset ${label}`} onClick={onReset} disabled={!changed}>Reset</Button>
        </Flex>
        {fieldControl(children, labelId)}
        {problem && <Text variant="caption" role="alert" className="option-field__problem">{problem}</Text>}
      </Stack>
    </Box>
  );
};

export { OptionField };
