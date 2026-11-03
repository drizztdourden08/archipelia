/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Field, Grid, TextInput } from '@drizztdourden08/tessera/primitives';
import { NAME_LIMIT } from '@archipelia/sessions/validation';
import { SLOT_DIALOG } from '../../behavior/slot.constants';
import { GameCell } from '../GameCell';
import { PlayerSourceCell } from '../PlayerSourceCell';
import type { SlotFieldsProps } from './SlotFields.type';

const SlotFields = ({ player, installed, presets, allowed, appGame, busy, actions }: SlotFieldsProps) => {
  const { slot } = player;
  const rename = useCallback((event: ChangeEvent<HTMLInputElement>) => actions.rename(slot, event.target.value), [actions, slot]);
  return (
    <Grid gap="md" minColWidth={200}>
      <Box data-cell="name">
        <Field label={SLOT_DIALOG.name} width="full">
          <TextInput value={player.name} placeholder={SLOT_DIALOG.name} maxLength={NAME_LIMIT} onChange={rename} />
        </Field>
      </Box>
      <Box data-cell="game">
        <Field label={SLOT_DIALOG.game} width="full">
          <GameCell player={player} installed={installed} allowed={allowed} onGame={actions.setGame} />
        </Field>
      </Box>
      <Box data-cell="source">
        <Field label={appGame ? SLOT_DIALOG.playerFile : SLOT_DIALOG.profile} width="full">
          <PlayerSourceCell player={player} presets={presets} appGame={appGame} noted={false} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />
        </Field>
      </Box>
    </Grid>
  );
};

export { SlotFields };
