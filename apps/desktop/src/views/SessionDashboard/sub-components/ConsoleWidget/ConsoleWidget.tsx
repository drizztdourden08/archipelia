/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Button, ButtonRow, Flex, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { ConsoleWidgetProps } from './ConsoleWidget.type';
import { useConsole } from '../../behavior/useConsole';
import { ConsolePlayer } from '../ConsolePlayer';

const ConsoleWidget = ({ session, enabled }: ConsoleWidgetProps) => {
  const { confirmSend, draft, error, send, sent, setDraft, submit } = useConsole(session.id);
  const change = useCallback((event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value), [setDraft]);
  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter') submit(); }, [submit]);
  const save = useCallback(() => { void send('/save'); }, [send]);
  const players = useCallback(() => { void send('/players'); }, [send]);
  return (
    <Stack gap="sm" className="session-panel">
      <Flex gap="xs">
        <TextInput aria-label="Server command" placeholder="/hint Johnny Moon Pearl" value={draft} disabled={!enabled} onChange={change} onKeyDown={keyDown} />
        <Button size="sm" variant="primary" disabled={!enabled || !draft.trim()} onClick={submit}>Send</Button>
      </Flex>
      <ButtonRow align="start" gap="xs">
        <Button size="sm" variant="secondary" disabled={!enabled} onClick={save}>Save</Button>
        <Button size="sm" variant="secondary" disabled={!enabled} onClick={players}>Players</Button>
      </ButtonRow>
      {!enabled && <Text variant="caption">Commands need a hosting room.</Text>}
      {error && <Text variant="caption" role="alert">{error}</Text>}
      {enabled && session.snapshot.players.map((player) => (
        <ConsolePlayer key={player.slot} name={player.name} onConfirm={confirmSend} />
      ))}
      {sent.map((cmd, i) => <Text key={`${i}-${cmd}`} variant="caption" className="session-panel__mono">{`> ${cmd}`}</Text>)}
    </Stack>
  );
};

export { ConsoleWidget };
