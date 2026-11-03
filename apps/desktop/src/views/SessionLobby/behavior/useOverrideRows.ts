/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { PRE_ROLLED_KEY, playerFileOf } from '@archipelia/model';
import type { GamePreset, InstalledGame } from '@archipelia/model';
import type { Overrides } from '../SessionLobby.type';
import { overrideRows } from './override-rows';

const useOverrideRows = (game: InstalledGame | undefined, preset: GamePreset | undefined, overrides: Overrides) => {
  const [query, setQuery] = useState('');
  const [changedOnly, setChangedOnly] = useState(false);
  const readOnly = game !== undefined && playerFileOf(game) === 'app';
  const rows = useMemo(() => {
    if (!game) return [];
    return overrideRows(game.schema, preset, overrides, { query, changedOnly }).filter((row) => !readOnly || row.def.key !== PRE_ROLLED_KEY);
  }, [changedOnly, game, overrides, preset, query, readOnly]);
  return { query, setQuery, changedOnly, setChangedOnly, readOnly, rows };
};

export { useOverrideRows };
