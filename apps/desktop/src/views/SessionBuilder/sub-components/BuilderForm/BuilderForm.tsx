/* @layer renderer-app @kind component */
import { useCallback, useEffect, useId, useState } from 'react';
import { Box, Callout, Divider, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import type { BuilderFormProps } from './BuilderForm.type';
import { buttonReason } from '../../behavior/button-reason';
import { changesText } from '../../behavior/changes-text';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { RoomSettings } from '../RoomSettings';
import { BuilderActions } from '../BuilderActions';
import { BuilderHeader } from '../BuilderHeader';
import { HistoryLink } from '../HistoryLink';
import { SessionPlayers } from '../SessionPlayers';
import { SetupFields } from '../SetupFields';
import { SETUP_TEXT } from '../../SessionBuilder.constants';
import './BuilderForm.css';

const BuilderForm = ({ initial, onDirty }: BuilderFormProps) => {
  const builder = useSessionBuilder(initial);
  const { draft, actions } = builder;
  const reasonId = useId();
  const [advanced, setAdvanced] = useState(false);
  const openWorld = useCallback(() => setAdvanced(true), []);
  useEffect(() => {
    onDirty?.(builder.dirty);
    return () => onDirty?.(false);
  }, [builder.dirty, onDirty]);
  const first = actions.buttons[0];
  return (
    <Stack gap="md" className="builder-form">
      <Box data-tour={TOUR_TARGET.builderBar}>
        <BuilderHeader
          name={draft.name}
          stored={builder.stored}
          saved={builder.saved}
          changes={actions.changes ? changesText(actions.changes) : null}
          tabOpen={builder.tab !== undefined}
          reason={first ? buttonReason(first, actions.reasons) : undefined}
          reasonId={reasonId}
          actions={<BuilderActions buttons={actions.buttons} busy={builder.busy} reasons={actions.reasons} reasonId={reasonId} on={actions.on} />}
          onName={builder.setName}
        >
          {builder.stored && <HistoryLink sessionId={draft.id} runs={builder.runCount} />}
        </BuilderHeader>
      </Box>
      {builder.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={builder.reloadData} />}
      {builder.error && <ErrorCallout message={builder.error} />}
      {builder.live && <Callout tone="info">{SETUP_TEXT.live}</Callout>}
      <Divider />
      <SetupFields builder={builder} onWorld={openWorld} />
      <RoomSettings builder={builder} open={advanced} onOpenChange={setAdvanced} />
      <Divider />
      <Box data-tour={TOUR_TARGET.sessionsPlayers}>
        <SessionPlayers builder={builder} />
      </Box>
    </Stack>
  );
};

export { BuilderForm };
