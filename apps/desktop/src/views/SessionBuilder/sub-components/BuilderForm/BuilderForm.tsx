/* @layer renderer-app @kind component */
import { Box, Stack } from '@drizztdourden08/tessera/primitives';
import type { BuilderFormProps } from './BuilderForm.type';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { sourcesOf } from '../../behavior/player-sources';
import { BuilderHeader } from '../BuilderHeader';
import { ProblemList } from '../ProblemList';
import { PlayersCard } from '../PlayersCard';
import { OverridesPanel } from '../OverridesPanel';
import { ErrorCallout } from '@archipelia/design';
import { BuilderSettings } from '../BuilderSettings';
import { LobbyMembers } from '../../../LobbyMembers';
import { FAILURE } from '../../SessionBuilder.constants';

const BuilderForm = ({ initial, onRun }: BuilderFormProps) => {
  const builder = useSessionBuilder({ initial, onRun });
  const { draft, selected, players, toggleSelected } = builder;
  const { game, preset } = sourcesOf(selected, builder.installed, builder.presets);

  return (
    <Box ref={builder.rootRef}>
      <Stack>
        <BuilderHeader
          name={draft.name}
          saved={builder.saved}
          busy={builder.busy}
          onName={builder.setName}
          onSave={builder.save}
          onRun={builder.run}
        />
        {builder.dataFailed && <ErrorCallout message={FAILURE.data} onRetry={builder.reloadData} />}
        {builder.error && <ErrorCallout message={builder.error} />}
        <ProblemList problems={builder.problems} attempted={builder.runAttempted} onShow={builder.showProblem} />
        <PlayersCard
          players={draft.players}
          installed={builder.installed}
          presets={builder.presets}
          selectedSlot={selected?.slot}
          busy={builder.busy}
          direct={draft.direct !== undefined}
          actions={players}
          onEdit={toggleSelected}
        />
        {draft.direct && <LobbyMembers serverId={draft.direct.serverId} lobbyId={draft.direct.lobbyId} />}
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
        <BuilderSettings builder={builder} />
      </Stack>
    </Box>
  );
};

export { BuilderForm };
