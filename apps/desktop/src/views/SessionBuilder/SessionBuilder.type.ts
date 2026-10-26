/* @layer renderer-app @kind types */
import type { GamePreset, HostTarget, InstalledGame, LobbyServerEntry, OptionDef, OptionValue, ServerEntry, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { DirectOptions } from '../../lobbies/lobbies.type';
import type { PresetInput } from '@archipelia/presets';
import type { AppSettings } from '../../settings.type';

type BuilderParams = { initial: SessionTemplate; onRun: (template: SessionTemplate) => void | Promise<void> };

type LibraryView = { installed: InstalledGame[]; presets: GamePreset[] };

type Overrides = Record<string, OptionValue>;

type HostingDefaults = { defaultHost: AppSettings['hostingDefaultHost']; localPort: number; ggBaseUrl: string; server: ServerSettings };

type SessionBuilderProps = { templateId?: string };

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

type DirectDeps = {
  draft: SessionTemplate;
  setDraft: Dispatch<SetStateAction<SessionTemplate>>;
  persist: (template: SessionTemplate) => Promise<SessionTemplate>;
  guard: (key: string, work: () => Promise<unknown>) => Promise<unknown>;
  localHost: (host: HostTarget) => HostTarget;
};

type SessionPlace = 'local' | 'lan' | 'remote';

type PlaceView = { draft: SessionTemplate; lobbyServers: readonly LobbyServerEntry[]; connected: number };

type RemoteView = PlaceView & { servers: readonly ServerEntry[] };

type PlaceDeps = {
  draft: SessionTemplate;
  servers: readonly ServerEntry[];
  hosting: HostingDefaults;
  setHost: (change: (host: HostTarget) => HostTarget) => void;
  moveTo: (serverId: string) => void;
};

type JoinRowsInput = {
  draft: SessionTemplate;
  place: SessionPlace;
  placeOptions: readonly SettingsOption[];
  remoteOptions: readonly SettingsOption[];
  remoteValue: string;
  busy: boolean;
  password: ReactNode;
  onPlace: (place: SessionPlace) => void;
  onRemote: (value: string) => void;
  onPort: (port: number) => void;
  onAllow: (on: boolean) => void;
  onOptions: (patch: Partial<DirectOptions>) => void;
};

type RunAction ={ label: string; reason?: string; onClick: () => void };

type RunHandlers = { run: () => void; open: () => void };

type ImportedYaml = { fileName: string; yaml: string; game: string };

type ProblemField = 'session-name' | 'players' | 'name' | 'game' | 'source' | 'option' | 'host';

type TemplateProblem = { message: string; field: ProblemField; slot?: number; optionKey?: string; optionLabel?: string };

export type {
  BuilderParams, DirectDeps, EditorDeps, HostingDefaults, ImportedYaml, JoinRowsInput, LibraryView, OverrideRow, Overrides, PlaceDeps, PlaceView, ProblemField, RemoteView, RowFilter, RunAction, RunHandlers, SessionBuilderProps,
  SessionPlace, SourceChoice, TemplateProblem,
};
