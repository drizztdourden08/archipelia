/* @layer renderer-app @kind types */
import type { DirectConnection, LobbyServerEntry, ServerEntry, ServerSettings, SessionTemplate } from '@archipelia/model';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { AppSettings } from '../../settings.type';

type HostingDefaults = { defaultHost: AppSettings['hostingDefaultHost']; localPort: number; ggBaseUrl: string; server: ServerSettings };

type SessionBuilderProps = { templateId?: string };

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

type StartAction = { label: string; reason?: string; onClick: () => void };

export type { HostingDefaults, JoinRowsInput, PlaceContext, PlaceDeps, PlaceView, RemoteView, SessionBuilderProps, SessionPlace, StartAction };
