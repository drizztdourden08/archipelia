/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CommandConsole } from '@archipelia/design';
import type { ConsoleWidgetProps } from './ConsoleWidget.type';
import { useConsole } from '../../behavior/useConsole';
import { ConsolePlayer } from '../ConsolePlayer';

const ConsoleWidget = ({ session, lines, enabled }: ConsoleWidgetProps) => {
  const { confirmSend, draft, history, rows, send, setDraft, submit } = useConsole(session.id, lines);
  const save = useCallback(() => { void send('/save'); }, [send]);
  const players = useCallback(() => { void send('/players'); }, [send]);
  const quick = (
    <ButtonRow align="start" gap="xs">
      <Button size="sm" variant="secondary" disabled={!enabled} onClick={save}>Save</Button>
      <Button size="sm" variant="secondary" disabled={!enabled} onClick={players}>Players</Button>
    </ButtonRow>
  );
  return (
    <Stack gap="sm">
      <CommandConsole
        rows={rows}
        history={history}
        value={draft}
        onValueChange={setDraft}
        onSubmit={submit}
        disabled={!enabled}
        actions={quick}
        label="Server command"
        placeholder="/hint Johnny Moon Pearl"
        emptyLabel="Replies show here under each command."
      />
      {!enabled && <Text variant="caption">Commands need a hosting room.</Text>}
      {enabled && (
        <Stack gap="xs" className="console-players">
          {session.snapshot.players.map((player) => <ConsolePlayer key={player.slot} name={player.name} onConfirm={confirmSend} />)}
        </Stack>
      )}
    </Stack>
  );
};

export { ConsoleWidget };
