/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Field, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import { sourcesOf } from '../../../SessionLobby/behavior/player-sources';
import { GameCell } from '../../../SessionLobby/sub-components/GameCell';
import { OverridesPanel } from '../../../SessionLobby/sub-components/OverridesPanel';
import { PlayerOverridesCell } from '../../../SessionLobby/sub-components/PlayerOverridesCell';
import { PlayerSourceCell } from '../../../SessionLobby/sub-components/PlayerSourceCell';
import { NAME_LIMIT } from '../../../SessionLobby/SessionLobby.constants';
import { PLAYER_TEXT } from '../../SessionBuilder.constants';
import type { PlayerEditorProps } from './PlayerEditor.type';
import './PlayerEditor.css';

const PlayerEditor = ({ player, installed, presets, busy, overrides, actions, onOverrides }: PlayerEditorProps) => {
  const { slot } = player;
  const rename = useCallback((event: ChangeEvent<HTMLInputElement>) => actions.rename(slot, event.target.value), [actions, slot]);
  const { game, preset } = sourcesOf(player, installed, presets);
  return (
    <Stack gap="md">
      <Box className="player-editor">
        <Field label={PLAYER_TEXT.name}>
          <TextInput value={player.name} placeholder={PLAYER_TEXT.name} maxLength={NAME_LIMIT} onChange={rename} />
        </Field>
        <Field label={PLAYER_TEXT.game}>
          <GameCell player={player} installed={installed} onGame={actions.setGame} />
        </Field>
        <Field label={PLAYER_TEXT.source}>
          <PlayerSourceCell player={player} presets={presets} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />
        </Field>
        <Field label={PLAYER_TEXT.overrides}>
          <PlayerOverridesCell player={player} selected={overrides} onEdit={onOverrides} />
        </Field>
      </Box>
      {overrides && (
        <OverridesPanel
          player={player}
          game={game}
          preset={preset}
          onValue={actions.setOverride}
          onReset={actions.resetOverride}
          onResetAll={actions.resetAll}
          onClose={onOverrides}
        />
      )}
    </Stack>
  );
};

export { PlayerEditor };
