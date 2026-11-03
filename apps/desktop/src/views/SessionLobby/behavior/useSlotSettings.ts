/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { PRE_ROLLED_KEY, playerFileOf } from '@archipelia/model';
import type { GamePreset, InstalledGame, OptionValue, SetPlayer } from '@archipelia/model';
import { checkValues, resolveValues, valueOf } from '@archipelia/presets';
import type { PlayersEditor } from '../SessionLobby.type';
import { overridesOf } from './overrides-of';
import { sourcesOf } from './player-sources';

const useSlotSettings = (player: SetPlayer, installed: InstalledGame[], presets: GamePreset[], actions: PlayersEditor) => {
  const { slot } = player;
  const { game, preset } = sourcesOf(player, installed, presets);
  const overrides = overridesOf(player);
  const readOnly = game !== undefined && playerFileOf(game) === 'app';
  const schema = useMemo(
    () => (game && readOnly ? { ...game.schema, options: game.schema.options.filter((def) => def.key !== PRE_ROLLED_KEY) } : game?.schema),
    [game, readOnly],
  );
  const values = useMemo(() => (schema ? resolveValues(schema, preset?.values ?? {}, overrides) : {}), [overrides, preset, schema]);
  const problems = useMemo(
    () => new Map((schema ? checkValues(schema, values) : []).map((problem) => [problem.key, `must be ${problem.expected}`])),
    [schema, values],
  );
  const onChange = useCallback((key: string, value: OptionValue) => {
    const def = schema?.options.find((option) => option.key === key);
    if (!schema || !def) return;
    actions.setOverride(slot, key, value, valueOf(resolveValues(schema, preset?.values ?? {}), def));
  }, [actions, preset, schema, slot]);
  const resetAll = useCallback(() => actions.resetAll(slot), [actions, slot]);
  return { schema, values, problems, readOnly, onChange, resetAll, changed: Object.keys(overrides).length > 0 };
};

export { useSlotSettings };
