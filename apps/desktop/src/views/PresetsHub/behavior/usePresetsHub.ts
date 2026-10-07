/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { buildPresetRows } from './build-preset-rows';
import { schemaFor } from './schema-for';
import { usePresetCreator } from './usePresetCreator';
import { usePresetActions } from './usePresetActions';
import { usePresetSelection } from './usePresetSelection';
import { usePresetEntries } from './usePresetEntries';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../PresetsHub.constants';

const usePresetsHub = () => {
  const { params, open } = useNavigation();
  const requestedId = typeof params.presetId === 'string' ? params.presetId : undefined;
  const { installed, presets, loadInstalled, loadPresets } = useLibraryStore();
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setLoadFailed(false);
    const fail = (err: unknown) => {
      logFailure(FAILURE.load, err);
      setLoadFailed(true);
    };
    void Promise.allSettled([loadPresets().catch(fail), loadInstalled().catch(fail)]).then(() => setLoading(false));
  }, [loadPresets, loadInstalled]);
  useEffect(load, [load]);

  usePresetEntries(presets);

  const rows = useMemo(() => buildPresetRows(installed, presets, Date.now()), [installed, presets]);
  const selection = usePresetSelection(requestedId);
  const selected = presets.find((preset) => preset.id === selection.selectedId) ?? null;
  const actions = usePresetActions({ selectedId: selected?.id ?? null, select: selection.select, follow: selection.follow });
  const creator = usePresetCreator({ installed, preferredGame: selected?.game, onCreated: selection.select });
  const schema = selected ? schemaFor(installed, selected.game) : undefined;
  const openGames = useCallback(() => open(ROUTE.games), [open]);

  return {
    actions, creator, loadFailed, loading: loading && rows.length === 0, openGames, retry: load, rows, schema, selected, selection,
  };
};

export { usePresetsHub };
