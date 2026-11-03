/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Field, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import { isAppGame } from '../../../SessionLobby/behavior/is-app-game';
import { sourcesOf } from '../../../SessionLobby/behavior/player-sources';
import { GameCell } from '../../../SessionLobby/sub-components/GameCell';
import { OverridesPanel } from '../../../SessionLobby/sub-components/OverridesPanel';
import { PlayerOverridesCell } from '../../../SessionLobby/sub-components/PlayerOverridesCell';
import { PlayerSourceCell } from '../../../SessionLobby/sub-components/PlayerSourceCell';
import { NAME_LIMIT } from '@archipelia/sessions/validation';
import { PLAYER_TEXT } from '../../SessionBuilder.constants';
import type { PlayerEditorProps } from './PlayerEditor.type';
import './PlayerEditor.css';

const PlayerEditor = ({ player, installed, presets, busy, overrides, actions, onOverrides }: PlayerEditorProps) => {
  const { slot } = player;
  const rename = useCallback((event: ChangeEvent<HTMLInputElement>) => actions.rename(slot, event.target.value), [actions, slot]);
  const sources = player.kind === 'set' ? sourcesOf(player, installed, presets) : null;
  const appGame = isAppGame(player, installed);
  return (
    <Stack gap="md">
      <Box className="player-editor">
        {player.kind === 'set' && (
          <Field label={PLAYER_TEXT.name}>
            <TextInput value={player.name} placeholder={PLAYER_TEXT.name} maxLength={NAME_LIMIT} onChange={rename} />
          </Field>
        )}
        <Field label={PLAYER_TEXT.game}>
          <GameCell player={player} installed={installed} onGame={actions.setGame} />
        </Field>
        {player.kind === 'set' && (
          <>
            <Field label={PLAYER_TEXT.source}>
              <PlayerSourceCell player={player} presets={presets} appGame={appGame} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />
            </Field>
            <Field label={PLAYER_TEXT.overrides}>
              <PlayerOverridesCell player={player} selected={overrides} appGame={appGame} onEdit={onOverrides} />
            </Field>
          </>
        )}
      </Box>
      {overrides && player.kind === 'set' && sources && (
        <OverridesPanel
          player={player}
          game={sources.game}
          preset={sources.preset}
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
