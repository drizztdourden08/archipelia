/* @layer renderer-app @kind types */
import type { GamePreset, GameSchema, OptionValue } from '@archipelia/model';
import type { OptionValues } from '@archipelia/presets';

type EditorStatus = { tone: 'info' | 'error'; text: string };

type PresetSave = () => Promise<boolean>;

type EditorParams = {
  preset: GamePreset;
  schema: GameSchema;
  onDirtyChange: (dirty: boolean) => void;
  onSaveChange: (save: PresetSave | null) => void;
};

type OptionTab = { id: string; label: string; count: number; changed: number };

type OptionFilter = { tab: string; query: string; showAdvanced: boolean };

type PresetEditorProps = EditorParams & {
  onDuplicate: (preset: GamePreset) => void;
  onDelete: (preset: GamePreset) => void;
};

type MoreActions = {
  busy: boolean;
  onDuplicate: () => void;
  onImport: () => void;
  onExport: () => void;
  onResetAll: () => void;
  onDelete: () => void;
};

type Values = Record<string, OptionValue>;

type TransferParams = {
  schema: GameSchema;
  name: string;
  values: OptionValues;
  replaceValues: (values: OptionValues) => void;
  report: (status: EditorStatus) => void;
};

type SaveFacts = { busy: boolean; dirty: boolean; block: string | null; failure: string | null; saved: boolean };

export type { EditorParams, EditorStatus, MoreActions, OptionFilter, OptionTab, PresetEditorProps, SaveFacts, TransferParams, Values };
