/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { OptionValue, SessionPlayer, SetPlayer } from '@archipelia/model';
import type { EditorDeps } from '../SessionLobby.type';
import { useYamlImport } from './useYamlImport';
import { updatePlayer } from './update-player';
import { addPlayer } from './add-player';
import { freeName } from './free-name';
import { presetsFor } from './presets-for';
import { removePlayer } from './remove-player';
import { duplicatePlayer } from './duplicate-player';
import { withDirect } from './with-direct';
import { withPickedGame } from './with-picked-game';
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
  const changeSet = useCallback((slot: number, edit: (player: SetPlayer) => SetPlayer) =>
    change(slot, (player) => (player.kind === 'set' ? edit(player) : player)), [change]);

  const add = useCallback(() => {
    const game = installed.length === 1 ? (installed[0]?.game ?? '') : '';
    setPlayers((players) => addPlayer(players, game, presetsFor(presets, game)[0]?.id ?? ''));
  }, [installed, presets, setPlayers]);
  const remove = useCallback((slot: number) => setPlayers((players) => removePlayer(players, slot)), [setPlayers]);
  const duplicate = useCallback((slot: number) => setPlayers((players) => duplicatePlayer(players, slot)), [setPlayers]);
  const replace = useCallback((player: SessionPlayer) => change(player.slot, () => player), [change]);
  const rename = useCallback((slot: number, name: string) => changeSet(slot, (player) => ({ ...player, name })), [changeSet]);
  const setGame = useCallback((slot: number, game: string) =>
    setPlayers((players) => updatePlayer(players, slot, (player) => withPickedGame(player, game, presets, freeName(players, 'Player')))), [presets, setPlayers]);
  const setDirect = useCallback((slot: number, on: boolean) =>
    setPlayers((players) => updatePlayer(players, slot, (player) => withDirect(player, on, freeName(players, 'Player')))), [setPlayers]);

  const importYaml = useCallback((slot: number) => guard(`yaml-${slot}`, async () => {
    const imported = await pickYaml();
    if (imported) changeSet(slot, (player) => withYaml(player, imported.fileName, imported.yaml, imported.game));
  }), [changeSet, guard, pickYaml]);

  const createDefault = useCallback((slot: number, game: string) => guard(`preset-${slot}`, async () => {
    const preset = await createPreset({ game, name: 'Default' });
    changeSet(slot, (player) => withPreset(player, preset.id));
  }), [changeSet, createPreset, guard]);

  const setSource = useCallback((slot: number, value: string, game: string) => {
    const choice = parseSource(value);
    if (choice.kind === 'preset') changeSet(slot, (player) => withPreset(player, choice.presetId));
    if (choice.kind === 'new-preset') void createDefault(slot, game);
    if (choice.kind === 'yaml') {
      changeSet(slot, (player) => (player.source.kind === 'yaml' ? player : withYaml(player, '', '', player.game)));
      void importYaml(slot);
    }
  }, [changeSet, createDefault, importYaml]);

  const setOverride = useCallback((slot: number, key: string, value: OptionValue, presetValue: OptionValue | undefined) =>
    changeSet(slot, (player) => withOverride(player, key, value, presetValue)), [changeSet]);
  const resetOverride = useCallback((slot: number, key: string) => changeSet(slot, (player) => withoutOverride(player, key)), [changeSet]);
  const resetAll = useCallback((slot: number) => changeSet(slot, withoutOverrides), [changeSet]);

  return { add, duplicate, importYaml, remove, rename, replace, resetAll, resetOverride, setDirect, setGame, setOverride, setSource };
};

export { usePlayersEditor };
