/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame, LobbyServerEntry, ServerEntry, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { Dispatch, SetStateAction } from 'react';
import type { PresetInput } from '@archipelia/presets';
import type { LiveTab } from '../../live/live.type';
import type { AppSettings } from '../../settings.type';
import type { useSessionRuns } from './behavior/useSessionRuns';

type HostingDefaults = { defaultHost: AppSettings['hostingDefaultHost']; localPort: number; ggBaseUrl: string; server: ServerSettings };

type SessionBuilderProps = { templateId?: string; onDirty?: (dirty: boolean) => void };

type SessionPlace = 'local' | 'lan' | 'remote';

type PlaceView = { draft: SessionTemplate; lobbyServers: readonly LobbyServerEntry[]; live: boolean };

type RemoteView = { draft: SessionTemplate; lobbyServers: readonly LobbyServerEntry[]; servers: readonly ServerEntry[] };

type PlaceContext = { lobbyServers: readonly LobbyServerEntry[]; servers: readonly ServerEntry[]; hosting: HostingDefaults };

type PlaceDeps = { draft: SessionTemplate; servers: readonly ServerEntry[]; hosting: HostingDefaults; live: boolean; setDraft: Dispatch<SetStateAction<SessionTemplate>> };

type DirectWorld = { game: string; listed: boolean };

type SessionPlayersDeps = {
  draft: SessionTemplate;
  setDraft: Dispatch<SetStateAction<SessionTemplate>>;
  installed: InstalledGame[];
  presets: GamePreset[];
  createPreset: (preset: PresetInput) => Promise<GamePreset>;
  guard: Guard;
};

type DirectState = {
  on: boolean;
  approval: boolean;
  unlisted: boolean;
  allowOff: boolean;
  optionsOff: boolean;
  hint: string;
  problem?: string;
};

type BuilderButton = 'tab' | 'run' | 'once' | 'save-run' | 'save' | 'discard';

type ButtonsInput = { stored: boolean; dirty: boolean; hasTab: boolean };

type ButtonReasons = { setup?: string; once?: string };

type UnsavedChanges = { count: number; runnable: boolean };

type Guard = (key: string, work: () => Promise<unknown>) => Promise<unknown>;

type SessionRunDeps = {
  draft: SessionTemplate;
  dirty: boolean;
  commit: (template: SessionTemplate) => Promise<SessionTemplate>;
  keep: (template: SessionTemplate) => Promise<SessionTemplate>;
  discard: () => void;
  guard: Guard;
  tab?: LiveTab;
};

type BuilderActionsInput = {
  draft: SessionTemplate;
  base: SessionTemplate;
  dirty: boolean;
  pending: boolean;
  stored: boolean;
  tab?: LiveTab;
  library: { installed: InstalledGame[]; presets: GamePreset[] };
  runs: ReturnType<typeof useSessionRuns>;
  onSave: () => void;
  onDiscard: () => void;
};

export type {
  BuilderActionsInput, BuilderButton, ButtonReasons, ButtonsInput, DirectState, DirectWorld, HostingDefaults, PlaceContext, PlaceDeps, PlaceView, RemoteView, SessionBuilderProps, SessionPlace,
  SessionPlayersDeps, SessionRunDeps, UnsavedChanges,
};
