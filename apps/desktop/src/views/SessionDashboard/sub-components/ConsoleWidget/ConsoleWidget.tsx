/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { setPlayers } from '@archipelia/model';
import { CommandConsole } from '@archipelia/design';
import type { ConsoleWidgetProps } from './ConsoleWidget.type';
import { useConsole } from '../../behavior/useConsole';
import { playerCommandGroups } from '../../behavior/player-command-groups';
import { consoleSpecsOf } from '../../behavior/console-specs-of';
import { useCommandSubmit } from '../../behavior/useCommandSubmit';

const ConsoleWidget = ({ session, lines, enabled }: ConsoleWidgetProps) => {
  const { confirmSend, draft, history, rows, send, setDraft } = useConsole(session.id, lines);
  const save = useCallback(() => { void send('/save'); }, [send]);
  const players = useCallback(() => { void send('/players'); }, [send]);
  const names = useMemo(() => setPlayers(session.snapshot.players).map((player) => player.name), [session.snapshot.players]);
  const specs = useMemo(() => consoleSpecsOf(names), [names]);
  const clearDraft = useCallback(() => setDraft(''), [setDraft]);
  const submit = useCommandSubmit(send, clearDraft);
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
        commandSpecs={specs}
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
