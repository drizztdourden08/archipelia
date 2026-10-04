/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, OptionDef, OptionValue, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { Dispatch, SetStateAction } from 'react';
import type { PresetInput } from '@archipelia/presets';
import type { AppSettings } from '../../settings.type';

type BuilderParams = { initial: SessionTemplate; onRun: (template: SessionTemplate) => void | Promise<void> };

type LibraryView = { installed: InstalledGame[]; presets: GamePreset[] };

type Overrides = Record<string, OptionValue>;

type HostingDefaults = { defaultHost: AppSettings['hostingDefaultHost']; localPort: number; ggBaseUrl: string; server: ServerSettings };

type SessionBuilderProps = {
  initial: SessionTemplate;
  onBack: () => void;
  onRun: (template: SessionTemplate) => void | Promise<void>;
};

type OverrideRow = { def: OptionDef; presetValue: OptionValue; value: OptionValue; overridden: boolean; problem?: string };

type RowFilter = { query?: string; changedOnly?: boolean };

type SourceChoice = { kind: 'preset'; presetId: string } | { kind: 'yaml' } | { kind: 'new-preset' };

type EditorDeps = {
  setDraft: Dispatch<SetStateAction<SessionTemplate>>;
  installed: InstalledGame[];
  presets: GamePreset[];
  createPreset: (preset: PresetInput) => Promise<GamePreset>;
  guard: (key: string, work: () => Promise<unknown>) => Promise<unknown>;
};

type ImportedYaml = { fileName: string; yaml: string; game: string };

export type { BuilderParams, EditorDeps, HostingDefaults, ImportedYaml, LibraryView, OverrideRow, Overrides, RowFilter, SessionBuilderProps, SourceChoice };
