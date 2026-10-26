/* @layer renderer-app @kind component */
import { Box, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout, ServerOptionsForm } from '@archipelia/design';
import type { BuilderFormProps } from './BuilderForm.type';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { useRunAction } from '../../behavior/useRunAction';
import { useConnectedCount } from '../../../../hooks/useConnectedCount';
import { sourcesOf } from '../../behavior/player-sources';
import { BuilderHeader } from '../BuilderHeader';
import { JoinCard } from '../JoinCard';
import { ProblemList } from '../ProblemList';
import { PlayersCard } from '../PlayersCard';
import { OverridesPanel } from '../OverridesPanel';
import { LobbyMembers } from '../../../LobbyMembers';
import { BUILDER_COLUMN_MIN, FAILURE } from '../../SessionBuilder.constants';

const BuilderForm = ({ initial, onRun }: BuilderFormProps) => {
  const builder = useSessionBuilder({ initial, onRun });
  const { draft, selected, players, toggleSelected } = builder;
  const { game, preset } = sourcesOf(selected, builder.installed, builder.presets);
  const connected = useConnectedCount(draft.direct);
  const action = useRunAction(draft, () => void builder.run(), () => void builder.direct.open());
  const lobbyId = draft.direct?.lobbyId;

  return (
    <Box ref={builder.rootRef}>
      <Stack>
        <BuilderHeader name={draft.name} saved={builder.saved} busy={builder.busy} action={action} onName={builder.setName} onSave={builder.save} />
        {builder.dataFailed && <ErrorCallout message={FAILURE.data} onRetry={builder.reloadData} />}
        {builder.error && <ErrorCallout message={builder.error} />}
        <ProblemList problems={builder.problems} attempted={builder.runAttempted} onShow={builder.showProblem} />
        <Grid minColWidth={BUILDER_COLUMN_MIN} fit gap="md">
          <Stack gap="md">
            <JoinCard builder={builder} />
            <PlayersCard
              players={draft.players}
              installed={builder.installed}
              presets={builder.presets}
              selectedSlot={selected?.slot}
              busy={builder.busy}
              direct={draft.direct !== undefined}
              connected={draft.direct && lobbyId && <LobbyMembers serverId={draft.direct.serverId} lobbyId={lobbyId} />}
              connectedCount={connected}
              actions={players}
              onEdit={toggleSelected}
            />
            {selected && (
              <OverridesPanel
                player={selected}
                game={game}
                preset={preset}
                onValue={players.setOverride}
                onReset={players.resetOverride}
                onResetAll={players.resetAll}
                onClose={toggleSelected}
              />
            )}
          </Stack>
          <ServerOptionsForm generator={draft.generator} server={draft.server} onGenerator={builder.setGenerator} onServer={builder.setServer} />
        </Grid>
      </Stack>
    </Box>
  );
};

export { BuilderForm };
