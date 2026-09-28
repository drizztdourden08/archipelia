/* @layer renderer-app @kind types */
import type { GamePreset, GameSchema, OptionValue } from '@archipelia/model';
import type { OptionValues } from '@archipelia/presets';

type EditorStatus = { tone: 'info' | 'error'; text: string };

type EditorParams = { preset: GamePreset; schema: GameSchema; onDirtyChange: (dirty: boolean) => void };

type OptionTab = { id: string; label: string; count: number };

type OptionFilter = { tab: string; query: string; showAdvanced: boolean };

type PresetEditorProps = {
  preset: GamePreset;
  schema: GameSchema;
  onDuplicate: (preset: GamePreset) => void;
  onDelete: (preset: GamePreset) => void;
  onDirtyChange: (dirty: boolean) => void;
};

type Values = Record<string, OptionValue>;

type TransferParams = {
  schema: GameSchema;
  name: string;
  values: OptionValues;
  replaceValues: (values: OptionValues) => void;
  report: (status: EditorStatus) => void;
};

export type { EditorParams, EditorStatus, OptionFilter, OptionTab, PresetEditorProps, TransferParams, Values };
