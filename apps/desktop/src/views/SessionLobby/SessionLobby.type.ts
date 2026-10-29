/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, OptionDef, OptionValue, SessionPlayer, SessionTemplate } from '@archipelia/model';
import type { Dispatch, SetStateAction } from 'react';
import type { PresetInput } from '@archipelia/presets';
import type { LiveTab } from '../../live/live.type';
import type { useLobbyScreen } from './behavior/useLobbyScreen';

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
  saveTemplate: (template: SessionTemplate) => Promise<SessionTemplate>;
  guard: (key: string, work: () => Promise<unknown>) => Promise<unknown>;
  attemptRun: () => boolean;
};

type SeatKind = 'saved' | 'added' | 'held';

type OwnSeat = { key: string; slot: number; player: SessionPlayer; kind: SeatKind };

type SeatActions = { edit: (slot: number) => void; remove: (slot: number) => void; duplicate: (slot: number) => void; keep: (slot: number) => void };

type LobbyScreenModel = ReturnType<typeof useLobbyScreen>;

type SeatContext = { presets: readonly GamePreset[]; problemSlots: ReadonlySet<number>; selectedSlot?: number; busy: boolean; actions: SeatActions };

type SeatEditing = { slot: number; overrides: boolean };

type RunAction = { label: string; reason?: string; onClick: () => void };

type ImportedYaml = { fileName: string; yaml: string; game: string };

type ProblemField = 'name' | 'game' | 'source' | 'option';

type TemplateProblem = { message: string; field: ProblemField; slot: number; optionKey?: string; optionLabel?: string };

export type {
  EditorDeps, ImportedYaml, LibraryView, LobbyActionDeps, LobbyScreenModel, LobbyScreenProps, OverrideRow, Overrides, OwnSeat, ProblemField, RowFilter, RunAction, SeatContext, SeatEditing, SessionLobbyProps, SourceChoice,
  TemplateProblem,
};
