/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Button, ButtonRow, Flex, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { BuilderHeaderProps } from './BuilderHeader.type';

const BuilderHeader = ({ name, saved, busy, canRun, onBack, onName, onSave, onRun }: BuilderHeaderProps) => {
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => onName(event.target.value), [onName]);
  return (
    <Flex justify="between" align="center" gap="sm" wrap>
      <Flex gap="sm" align="center" wrap>
        <Button variant="ghost" onClick={onBack}>Back to sessions</Button>
        <TextInput aria-label="Session name" value={name} placeholder="Session name" onChange={handleName} />
        {saved && <Text variant="caption">Saved</Text>}
      </Flex>
      <ButtonRow>
        <Button variant="secondary" disabled={busy} onClick={onSave}>Save</Button>
        <Button variant="primary" disabled={busy || !canRun} onClick={onRun}>Run</Button>
      </ButtonRow>
    </Flex>
  );
};

export { BuilderHeader };
