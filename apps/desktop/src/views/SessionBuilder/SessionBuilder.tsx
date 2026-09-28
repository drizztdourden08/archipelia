/* @layer renderer-app @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { SessionBuilderProps } from './SessionBuilder.type';
import { useSessionBuilder } from './behavior/useSessionBuilder';
import { sourcesOf } from './behavior/player-sources';
import { BuilderHeader } from './sub-components/BuilderHeader';
import { ProblemList } from './sub-components/ProblemList';
import { PlayersCard } from './sub-components/PlayersCard';
import { OverridesPanel } from './sub-components/OverridesPanel';
import { ServerOptionsForm } from '../../compounds/ServerOptionsForm';
import './SessionBuilder.css';

const SessionBuilder = ({ initial, onBack, onRun }: SessionBuilderProps) => {
  const builder = useSessionBuilder({ initial, onRun });
  const { draft, selected, players, toggleSelected } = builder;
  const { game, preset } = sourcesOf(selected, builder.installed, builder.presets);

  return (
    <Stack>
      <BuilderHeader
        name={draft.name}
        saved={builder.saved}
        busy={builder.busy}
        canRun={builder.problems.length === 0}
        onBack={onBack}
        onName={builder.setName}
        onSave={builder.save}
        onRun={builder.run}
      />
      {builder.error && <Text variant="body" role="alert" className="session-builder__error">{builder.error}</Text>}
      <ProblemList problems={builder.problems} />
      <PlayersCard
        players={draft.players}
        installed={builder.installed}
        presets={builder.presets}
        selectedSlot={selected?.slot}
        busy={builder.busy}
        actions={players}
        onEdit={toggleSelected}
      />
      <Flex gap="md" align="start" wrap className="session-builder__columns">
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
      </Flex>
    </Stack>
  );
};

export { SessionBuilder };
