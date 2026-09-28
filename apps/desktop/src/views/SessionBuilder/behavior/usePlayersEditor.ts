/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { OptionValue, SessionPlayer } from '@archipelia/model';
import type { EditorDeps } from '../SessionBuilder.type';
import { useYamlImport } from './useYamlImport';
import { updatePlayer } from './update-player';
import { addPlayer } from './add-player';
import { presetsFor } from './presets-for';
import { removePlayer } from './remove-player';
import { duplicatePlayer } from './duplicate-player';
import { withGame } from './with-game';
import { withYaml } from './with-yaml';
import { withPreset } from './with-preset';
import { parseSource } from './parse-source';
import { withOverride } from './with-override';
import { withoutOverride } from './without-override';
import { withoutOverrides } from './without-overrides';

const usePlayersEditor = ({ setDraft, installed, presets, createPreset, guard }: EditorDeps) => {
  const pickYaml = useYamlImport();
  const setPlayers = useCallback((change: (players: SessionPlayer[]) => SessionPlayer[]) =>
    setDraft((draft) => ({ ...draft, players: change(draft.players) })), [setDraft]);
  const change = useCallback((slot: number, edit: (player: SessionPlayer) => SessionPlayer) =>
    setPlayers((players) => updatePlayer(players, slot, edit)), [setPlayers]);

  const add = useCallback(() => {
    const game = installed.length === 1 ? (installed[0]?.game ?? '') : '';
    setPlayers((players) => addPlayer(players, game, presetsFor(presets, game)[0]?.id ?? ''));
  }, [installed, presets, setPlayers]);
  const remove = useCallback((slot: number) => setPlayers((players) => removePlayer(players, slot)), [setPlayers]);
  const duplicate = useCallback((slot: number) => setPlayers((players) => duplicatePlayer(players, slot)), [setPlayers]);
  const rename = useCallback((slot: number, name: string) => change(slot, (player) => ({ ...player, name })), [change]);
  const setGame = useCallback((slot: number, game: string) => change(slot, (player) => withGame(player, game, presets)), [change, presets]);

  const importYaml = useCallback((slot: number) => guard(async () => {
    const imported = await pickYaml();
    if (imported) change(slot, (player) => withYaml(player, imported.fileName, imported.yaml, imported.game));
  }), [change, guard, pickYaml]);

  const createDefault = useCallback((slot: number, game: string) => guard(async () => {
    const preset = await createPreset({ game, name: 'Default' });
    change(slot, (player) => withPreset(player, preset.id));
  }), [change, createPreset, guard]);

  const setSource = useCallback((slot: number, value: string, game: string) => {
    const choice = parseSource(value);
    if (choice.kind === 'preset') change(slot, (player) => withPreset(player, choice.presetId));
    if (choice.kind === 'new-preset') void createDefault(slot, game);
    if (choice.kind === 'yaml') {
      change(slot, (player) => (player.source.kind === 'yaml' ? player : withYaml(player, '', '', player.game)));
      void importYaml(slot);
    }
  }, [change, createDefault, importYaml]);

  const setOverride = useCallback((slot: number, key: string, value: OptionValue, presetValue: OptionValue | undefined) =>
    change(slot, (player) => withOverride(player, key, value, presetValue)), [change]);
  const resetOverride = useCallback((slot: number, key: string) => change(slot, (player) => withoutOverride(player, key)), [change]);
  const resetAll = useCallback((slot: number) => change(slot, withoutOverrides), [change]);

  return { add, duplicate, importYaml, remove, rename, resetAll, resetOverride, setGame, setOverride, setSource };
};

export { usePlayersEditor };
