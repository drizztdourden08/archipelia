/* @layer renderer-app @kind types */
import type { LobbySeatAction, LobbySeatSide, LobbySeatSideValue } from '@archipelia/design';
import type { AdminLobby, GamePreset, InstalledGame, OptionValue, SessionPlayer, SessionTemplate } from '@archipelia/model';
import type { Dispatch, SetStateAction } from 'react';
import type { PresetInput } from '@archipelia/presets';
import type { LiveTab } from '../../live/live.type';
import type { useLobbyScreen } from './behavior/useLobbyScreen';
import type { usePlayersEditor } from './behavior/usePlayersEditor';

type SessionLobbyProps = { tab: LiveTab };

type LobbyScreenProps = { tab: LiveTab; saved: SessionTemplate };

type Overrides = Record<string, OptionValue>;

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
  lobby: AdminLobby | undefined;
};

type SeatKind = 'saved' | 'added' | 'held';

type OwnSeat = { key: string; slot: number; player: SessionPlayer; kind: SeatKind };

type SeatActions = {
  edit: (slot: number) => void;
  remove: (slot: number) => void;
  duplicate: (slot: number) => void;
  keep: (slot: number) => void;
  pick: (slot: number, side: LobbySeatSideValue) => void;
};

type SeatParts = { side?: LobbySeatSide; tools: LobbySeatAction[] };

type FreshSlots = { fresh: ReadonlySet<string>; mark: (name: string) => void; settle: (name: string) => void };

type PlayersEditor = ReturnType<typeof usePlayersEditor>;

type SidePickInput = { players: PlayersEditor; seats: SessionPlayer[]; slots: FreshSlots; open: (slot: number) => void };

type LobbyScreenModel = ReturnType<typeof useLobbyScreen>;

type SeatContext = {
  presets: readonly GamePreset[];
  installed: InstalledGame[];
  problemSlots: ReadonlySet<number>;
  direct: boolean;
  fresh: ReadonlySet<string>;
  busy: boolean;
  actions: SeatActions;
};

type SeatEditing = { slot: number; option?: string };

type RunAction = { label: string; reason?: string; onClick: () => void };

type ImportedYaml = { fileName: string; yaml: string; game: string };

export type {
  EditorDeps, FreshSlots, ImportedYaml, LobbyActionDeps, LobbyScreenModel, LobbyScreenProps, Overrides, OwnSeat, PlayersEditor, RunAction, SeatContext, SeatEditing, SeatParts, SessionLobbyProps, SidePickInput, SourceChoice,
};
