/* @layer renderer-app @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { descriptionPreview } from './behavior/description-preview';
import type { OptionFieldProps } from './OptionField.type';
import './OptionField.css';

const OptionField = ({ label, description, hint, changed, advanced, problem, onReset, children }: OptionFieldProps) => {
  const [expanded, setExpanded] = useState(false);
  const { preview, long } = useMemo(() => descriptionPreview(description), [description]);
  const handleToggle = useCallback(() => setExpanded((open) => !open), []);
  return (
    <Box className={`option-field${problem ? ' option-field--problem' : ''}`} role="group" aria-label={label}>
      <Stack gap="xs" className="option-field__about">
        <Flex gap="sm" align="center" wrap>
          <Text variant="label">{label}</Text>
          {advanced && <Badge variant="neutral">advanced</Badge>}
        </Flex>
        {description && <Text variant="caption" className="option-field__description">{expanded ? description.trim() : preview}</Text>}
        {long && (
          <Box>
            <Button size="sm" variant="ghost" onClick={handleToggle} aria-expanded={expanded}>{expanded ? 'Less' : 'More'}</Button>
          </Box>
        )}
        {hint && <Text variant="caption" className="option-field__hint">{hint}</Text>}
      </Stack>
      <Stack gap="xs" className="option-field__control">
        <Flex gap="sm" align="center" justify="end">
          {changed && <Badge variant="warning">changed</Badge>}
          <Button size="sm" variant="tertiary" aria-label={`Reset ${label}`} onClick={onReset} disabled={!changed}>Reset</Button>
        </Flex>
        {children}
        {problem && <Text variant="caption" role="alert" className="option-field__problem">{problem}</Text>}
      </Stack>
    </Box>
  );
};

export { OptionField };
