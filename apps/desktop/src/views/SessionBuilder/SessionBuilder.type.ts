/* @layer renderer-app @kind types */
import type { DirectConnection, GamePreset, InstalledGame, LobbyServerEntry, ServerEntry, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
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

type JoinRowsInput = {
  draft: SessionTemplate;
  live: boolean;
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
  onOptions: (patch: Partial<DirectConnection>) => void;
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
  BuilderActionsInput, BuilderButton, ButtonReasons, ButtonsInput, HostingDefaults, JoinRowsInput, PlaceContext, PlaceDeps, PlaceView, RemoteView, SessionBuilderProps, SessionPlace,
  SessionRunDeps, UnsavedChanges,
};
