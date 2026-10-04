/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { EditorParams, EditorStatus } from '../PresetEditor.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { usePresetDraft } from './usePresetDraft';
import { useOptionFilter } from './useOptionFilter';
import { useYamlTransfer } from './useYamlTransfer';
import { problemMap } from './problem-map';
import { problemSummary } from './problem-summary';
import { UNSAVED_PRESET } from '../PresetEditor.constants';

const usePresetEditor = ({ preset, schema, onDirtyChange }: EditorParams) => {
  const { savePreset } = useLibraryStore();
  const draft = usePresetDraft(preset, schema);
  const filter = useOptionFilter(schema);
  const [status, setStatus] = useState<EditorStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const transfer = useYamlTransfer({ schema, name: draft.name, values: draft.values, replaceValues: draft.replaceValues, report: setStatus });

  useUnsavedChanges(draft.dirty, UNSAVED_PRESET);
  useEffect(() => { onDirtyChange(draft.dirty); }, [draft.dirty]);
  useEffect(() => () => onDirtyChange(false), []);

  const problems = useMemo(() => problemMap(draft.problems), [draft.problems]);
  const summary = useMemo(() => problemSummary(schema, draft.problems), [schema, draft.problems]);
  const name = draft.name.trim();
  const canSave = draft.dirty && !draft.problems.length && name !== '' && !busy;

  const save = useCallback(async () => {
    setBusy(true);
    try {
      await savePreset({ ...preset, name, values: draft.changed });
      setStatus({ tone: 'info', text: 'Saved.' });
      toast(`Saved the preset ${name}`, { variant: 'success' });
    } catch (err) {
      setStatus({ tone: 'error', text: (err as Error).message });
      toast(`The preset ${name} was not saved: ${(err as Error).message}`, { variant: 'danger' });
    } finally {
      setBusy(false);
    }
  }, [savePreset, preset, name, draft.changed]);

  const resetAll = useCallback(() => {
    draft.resetAll();
    setStatus({ tone: 'info', text: 'Every option is back to its default. Save to keep it.' });
  }, [draft.resetAll]);

  return { busy, canSave, draft, filter, problems, resetAll, save, status, summary, transfer };
};

export { usePresetEditor };
