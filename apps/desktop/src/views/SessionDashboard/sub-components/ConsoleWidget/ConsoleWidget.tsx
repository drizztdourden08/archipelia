/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { CommandConsole } from '@archipelia/design';
import type { ConsoleWidgetProps } from './ConsoleWidget.type';
import { useConsole } from '../../behavior/useConsole';
import { playerCommandGroups } from '../../behavior/player-command-groups';

const ConsoleWidget = ({ session, lines, enabled }: ConsoleWidgetProps) => {
  const { confirmSend, draft, history, rows, send, setDraft, submit } = useConsole(session.id, lines);
  const save = useCallback(() => { void send('/save'); }, [send]);
  const players = useCallback(() => { void send('/players'); }, [send]);
  const names = useMemo(() => session.snapshot.players.map((player) => player.name), [session.snapshot.players]);
  const groups = useMemo(() => playerCommandGroups(names, confirmSend, !enabled), [names, confirmSend, enabled]);
  const quick = (
    <ButtonRow align="start" gap="xs">
      <Button size="sm" variant="secondary" disabled={!enabled} onClick={save}>Save</Button>
      <Button size="sm" variant="secondary" disabled={!enabled} onClick={players}>Players</Button>
      <DropdownMenu trigger={{ label: 'Player commands', icon: 'users' }} variant="secondary" size="sm" groups={groups} />
    </ButtonRow>
  );
  return (
    <Stack gap="sm" className="console-widget">
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
    </Stack>
  );
};

export { ConsoleWidget };
