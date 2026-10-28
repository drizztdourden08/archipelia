/* @layer renderer-app @kind component */
import { useEffect } from 'react';
import { Box, Callout, Flex, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout, ServerOptionsForm } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { PlayersEditor } from '../../../SessionLobby';
import type { BuilderFormProps } from './BuilderForm.type';
import { changesText } from '../../behavior/changes-text';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { BuilderActions } from '../BuilderActions';
import { BuilderHeader } from '../BuilderHeader';
import { HistoryLink } from '../HistoryLink';
import { JoinCard } from '../JoinCard';
import { BUILDER_COLUMN_MIN, SETUP_TEXT } from '../../SessionBuilder.constants';

const BuilderForm = ({ initial, onDirty }: BuilderFormProps) => {
  const builder = useSessionBuilder(initial);
  const { draft, actions } = builder;
  useEffect(() => {
    onDirty?.(builder.dirty);
    return () => onDirty?.(false);
  }, [builder.dirty, onDirty]);
  return (
    <Stack>
      <Flex justify="between" align="start" gap="sm" wrap data-tour={TOUR_TARGET.builderBar}>
        <BuilderHeader name={draft.name} saved={builder.saved} changes={actions.changes ? changesText(actions.changes) : null} onName={builder.setName}>
          {builder.stored && <HistoryLink sessionId={draft.id} runs={builder.runCount} />}
        </BuilderHeader>
        <BuilderActions buttons={actions.buttons} busy={builder.busy} reasons={actions.reasons} on={actions.on} />
      </Flex>
      {builder.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={builder.reloadData} />}
      {builder.error && <ErrorCallout message={builder.error} />}
      {builder.live && <Callout tone="info">{SETUP_TEXT.live}</Callout>}
      <Grid minColWidth={BUILDER_COLUMN_MIN} fit gap="md">
        <JoinCard builder={builder} />
        <ServerOptionsForm generator={draft.generator} server={draft.server} onGenerator={builder.setGenerator} onServer={builder.setServer} />
      </Grid>
      <Box data-tour={TOUR_TARGET.sessionsPlayers}>
        <PlayersEditor
          draft={draft}
          setDraft={builder.setDraft}
          installed={builder.installed}
          presets={builder.presets}
          createPreset={builder.createPreset}
          guard={builder.guard}
          busy={builder.busy}
        />
      </Box>
    </Stack>
  );
};

export { BuilderForm };
