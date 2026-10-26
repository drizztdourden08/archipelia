/* @layer renderer-app @kind component */
import { useCallback, useId } from 'react';
import type { ChangeEvent } from 'react';
import { Button, ButtonRow, Flex, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { BuilderHeaderProps } from './BuilderHeader.type';

const BuilderHeader = ({ name, saved, busy, action, onName, onSave }: BuilderHeaderProps) => {
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => onName(event.target.value), [onName]);
  const reasonId = useId();
  return (
    <Flex justify="between" align="center" gap="sm" wrap>
      <Flex gap="sm" align="center" wrap>
        <TextInput aria-label="Session name" data-problem-target="session-name" value={name} placeholder="Session name" onChange={handleName} />
        {saved && <Text variant="caption">Saved</Text>}
      </Flex>
      <Flex gap="sm" align="center" wrap>
        {action.reason && <Text id={reasonId} variant="caption" tone="dim">{action.reason}</Text>}
        <ButtonRow>
          <Button variant="secondary" disabled={busy} onClick={onSave}>Save</Button>
          <Button variant="primary" disabled={busy || action.reason !== undefined} aria-describedby={action.reason ? reasonId : undefined} onClick={action.onClick}>
            {action.label}
          </Button>
        </ButtonRow>
      </Flex>
    </Flex>
  );
};

export { BuilderHeader };
