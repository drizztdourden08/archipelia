/* @layer renderer-app @kind component */
import { Box, Callout, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import type { BuilderFormProps } from './BuilderForm.type';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { sourcesOf } from '../../behavior/player-sources';
import { BuilderHeader } from '../BuilderHeader';
import { ProblemList } from '../ProblemList';
import { PlayersCard } from '../PlayersCard';
import { OverridesPanel } from '../OverridesPanel';
import { ServerOptionsForm } from '@archipelia/design';

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
        {builder.error && <Box role="alert"><Callout tone="danger">{builder.error}</Callout></Box>}
        <ProblemList problems={builder.problems} attempted={builder.runAttempted} onShow={builder.showProblem} />
        <PlayersCard
          players={draft.players}
          installed={builder.installed}
          presets={builder.presets}
          selectedSlot={selected?.slot}
          busy={builder.busy}
          actions={players}
          onEdit={toggleSelected}
        />
        <Grid minColWidth={384} gap="md">
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
          <ServerOptionsForm
            generator={draft.generator}
            server={draft.server}
            host={draft.host}
            serverOptions={builder.serverOptions}
            password={builder.password}
            hasPassword={Boolean(draft.server.passwordRef)}
            onGenerator={builder.setGenerator}
            onServer={builder.setServer}
            onHostKind={builder.setHostKind}
            onPort={builder.setPort}
            onRemoteServer={builder.setRemoteServer}
            onPassword={builder.setPassword}
            onClearPassword={builder.clearPassword}
          />
        </Grid>
      </Stack>
    </Box>
  );
};

export { BuilderForm };
