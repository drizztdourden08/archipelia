/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { buildPresetGroups } from './build-preset-groups';
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
  const [error, setError] = useState<string | null>(null);

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

  const groups = useMemo(() => buildPresetGroups(installed, presets, Date.now()), [installed, presets]);
  const selection = usePresetSelection(requestedId);
  const actions = usePresetActions({ select: selection.select, report: setError });
  const creator = usePresetCreator({ installed, onCreated: selection.select });

  const selected = presets.find((preset) => preset.id === selection.selectedId) ?? null;
  const schema = selected ? schemaFor(installed, selected.game) : undefined;
  const openGames = useCallback(() => open(ROUTE.games), [open]);
  const openNew = useCallback(() => creator.openFor(selected?.game), [creator.openFor, selected?.game]);

  return {
    actions, creator, error: loadFailed ? FAILURE.load : error, groups, loading, openGames, openNew, retry: loadFailed ? load : undefined, schema, selected, selection, total: presets.length,
  };
};

export { usePresetsHub };
