/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, OptionDef, OptionValue, SessionTemplate } from '@archipelia/model';
import type { Dispatch, SetStateAction } from 'react';
import type { PresetInput } from '@archipelia/presets';
import type { LiveTab } from '../../live/live.type';

type SessionLobbyProps = { tab: LiveTab };

type LobbyScreenProps = { tab: LiveTab; saved: SessionTemplate };

type LibraryView = { installed: InstalledGame[]; presets: GamePreset[] };

type Overrides = Record<string, OptionValue>;

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

type LobbyActionDeps = {
  tab: LiveTab;
  saved: SessionTemplate;
  draft: SessionTemplate;
  guard: (key: string, work: () => Promise<unknown>) => Promise<unknown>;
  attemptRun: () => boolean;
};

type RunAction = { label: string; reason?: string; onClick: () => void };

type ImportedYaml = { fileName: string; yaml: string; game: string };

type ProblemField = 'name' | 'game' | 'source' | 'option';

type TemplateProblem = { message: string; field: ProblemField; slot: number; optionKey?: string; optionLabel?: string };

export type {
  EditorDeps, ImportedYaml, LibraryView, LobbyActionDeps, LobbyScreenProps, OverrideRow, Overrides, ProblemField, RowFilter, RunAction, SessionLobbyProps, SourceChoice, TemplateProblem,
};
