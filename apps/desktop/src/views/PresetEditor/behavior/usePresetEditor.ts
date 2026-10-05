/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { EditorParams, EditorStatus } from '../PresetEditor.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { usePresetDraft } from './usePresetDraft';
import { useOptionFilter } from './useOptionFilter';
import { useYamlTransfer } from './useYamlTransfer';
import { problemMap } from './problem-map';
import { saveBlock } from './save-block';
import { saveState } from './save-state';
import { UNSAVED_PRESET } from '../PresetEditor.constants';

const usePresetEditor = ({ preset, schema, onDirtyChange, onSaveChange }: EditorParams) => {
  const { savePreset } = useLibraryStore();
  const draft = usePresetDraft(preset, schema);
  const filter = useOptionFilter(schema, draft.changed);
  const [status, setStatus] = useState<EditorStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const transfer = useYamlTransfer({ schema, name: draft.name, values: draft.values, replaceValues: draft.replaceValues, report: setStatus });

  const problems = useMemo(() => problemMap(draft.problems), [draft.problems]);
  const block = useMemo(() => saveBlock(schema, draft.name, draft.problems, draft.unparsed), [schema, draft.name, draft.problems, draft.unparsed]);
  const name = draft.name.trim();

  const save = useCallback(async () => {
    if (!draft.dirty) return true;
    if (block !== null) return false;
    setBusy(true);
    setFailure(null);
    try {
      await savePreset({ ...preset, name, values: draft.changed });
      setSaved(true);
      toast(`Saved the preset ${name}`, { variant: 'success' });
      return true;
    } catch (err) {
      setFailure((err as Error).message);
      toast(`The preset ${name} was not saved: ${(err as Error).message}`, { variant: 'danger' });
      return false;
    } finally {
      setBusy(false);
    }
  }, [savePreset, preset, name, draft.changed, draft.dirty, block]);

  useUnsavedChanges(draft.dirty, UNSAVED_PRESET);
  useEffect(() => { onDirtyChange(draft.dirty); }, [draft.dirty]);
  useEffect(() => () => onDirtyChange(false), []);
  useEffect(() => { onSaveChange(save); }, [save]);
  useEffect(() => () => onSaveChange(null), []);
  useEffect(() => {
    if (draft.dirty) setSaved(false);
    else setFailure(null);
  }, [draft.dirty]);

  const resetAll = useCallback(() => {
    draft.resetAll();
    setStatus({ tone: 'info', text: 'Every option is back to its default. Save to keep it.' });
  }, [draft.resetAll]);

  const revert = useCallback(() => {
    draft.revert();
    setStatus(null);
  }, [draft.revert]);

  const bar = { state: saveState({ busy, dirty: draft.dirty, block, failure, saved }), error: block ?? failure ?? undefined };

  return { bar, busy, draft, filter, problems, resetAll, revert, save, status, transfer };
};

export { usePresetEditor };
