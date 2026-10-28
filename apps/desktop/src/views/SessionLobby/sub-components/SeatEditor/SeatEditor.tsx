/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, Card, Field, SectionHeader, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import { playerLabel } from '../../behavior/player-label';
import { NAME_LIMIT, SEAT_EDITOR_CLASS, SEAT_TEXT } from '../../SessionLobby.constants';
import { GameCell } from '../GameCell';
import { PlayerOverridesCell } from '../PlayerOverridesCell';
import { PlayerSourceCell } from '../PlayerSourceCell';
import type { SeatEditorProps } from './SeatEditor.type';

const SeatEditor = ({ player, installed, presets, busy, overridesOpen, actions, onOverrides, onClose }: SeatEditorProps) => {
  const { slot } = player;
  const rename = useCallback((event: ChangeEvent<HTMLInputElement>) => actions.rename(slot, event.target.value), [actions, slot]);
  return (
    <Box as="section" className={SEAT_EDITOR_CLASS} aria-label={`${SEAT_TEXT.editTitle} ${slot}`}>
      <Card>
        <Stack gap="sm">
          <SectionHeader
            title={`${SEAT_TEXT.slot} ${slot}`}
            subtitle={playerLabel(player)}
            action={<Button size="sm" variant="ghost" onClick={onClose}>{SEAT_TEXT.done}</Button>}
          />
          <Box data-cell="name">
            <Field label={SEAT_TEXT.nameLabel} width="full">
              <TextInput value={player.name} placeholder={SEAT_TEXT.nameLabel} maxLength={NAME_LIMIT} onChange={rename} />
            </Field>
          </Box>
          <Box data-cell="game">
            <Field label={SEAT_TEXT.gameLabel} width="full">
              <GameCell player={player} installed={installed} onGame={actions.setGame} />
            </Field>
          </Box>
          <Box data-cell="source">
            <Field label={SEAT_TEXT.presetLabel} width="full">
              <PlayerSourceCell player={player} presets={presets} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />
            </Field>
          </Box>
          <Box data-cell="overrides">
            <Field label={SEAT_TEXT.overridesLabel} width="full">
              <PlayerOverridesCell player={player} selected={overridesOpen} onEdit={onOverrides} />
            </Field>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export { SeatEditor };
