/* @layer renderer-app @kind config */
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core';
import type { CatalogView, InstallRequest } from '@archipelia/catalog';
import type {
  AdminLobby, CatalogEntry, EngineChoice, EngineEvent, EngineInstallResult, EngineOverview, EngineStatus, GamePreset,
  InstalledGame, LobbyServerEntry, ServerEntry, Session, SessionTemplate, StartupDecision,
} from '@archipelia/model';
import type { HostLogLine, ServerTestResult } from '@archipelia/hosts';
import type { PresetInput } from '@archipelia/presets';
import type { SessionEvent } from '@archipelia/sessions';
import type {
  LanEntry, LobbyEvent, LobbyRequest, LobbyReviewHost, LobbyReviewPlay, LobbyServerOptions, LobbyServerStatus, LobbyServerTest, LobbyServerView,
} from '../lobbies/lobbies.type';

const APP_CHANNELS = defineChannels({
  engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'),
  engineSetup: invoke<() => Promise<EngineStatus>>()('ap:engine:setup'),
  engineOverview: invoke<(force?: boolean) => Promise<EngineOverview>>()('ap:engine:overview'),
  engineInstall: invoke<(choice: EngineChoice) => Promise<EngineInstallResult>>()('ap:engine:install'),
  engineSwitch: invoke<(id: string) => Promise<EngineOverview>>()('ap:engine:switch'),
  engineRemove: invoke<(id: string) => Promise<EngineOverview>>()('ap:engine:remove'),
  engineStartup: invoke<() => Promise<StartupDecision>>()('ap:engine:startup'),
  engineOfferShown: invoke<(version: string) => Promise<void>>()('ap:engine:offerShown'),
  catalogRead: invoke<(refresh: boolean) => Promise<CatalogView>>()('ap:catalog:read'),
  catalogOfficial: invoke<() => Promise<CatalogEntry[]>>()('ap:catalog:official'),
  gamesList: invoke<() => Promise<InstalledGame[]>>()('ap:games:list'),
  gamesInstall: invoke<(request: InstallRequest) => Promise<InstalledGame>>()('ap:games:install'),
  gamesRemove: invoke<(apworld: string) => Promise<void>>()('ap:games:remove'),
  presetsList: invoke<() => Promise<GamePreset[]>>()('ap:presets:list'),
  presetsCreate: invoke<(preset: PresetInput) => Promise<GamePreset>>()('ap:presets:create'),
  presetsSave: invoke<(preset: GamePreset) => Promise<GamePreset>>()('ap:presets:save'),
  presetsDuplicate: invoke<(id: string, name: string) => Promise<GamePreset>>()('ap:presets:duplicate'),
  presetsRemove: invoke<(id: string) => Promise<void>>()('ap:presets:remove'),
  templatesList: invoke<() => Promise<SessionTemplate[]>>()('ap:templates:list'),
  templatesSave: invoke<(template: SessionTemplate) => Promise<SessionTemplate>>()('ap:templates:save'),
  templatesRemove: invoke<(id: string) => Promise<void>>()('ap:templates:remove'),
  sessionsList: invoke<() => Promise<Session[]>>()('ap:sessions:list'),
  sessionsRun: invoke<(template: SessionTemplate) => Promise<Session>>()('ap:sessions:run'),
  sessionsStop: invoke<(id: string) => Promise<Session | undefined>>()('ap:sessions:stop'),
  sessionsCancel: invoke<(id: string) => Promise<void>>()('ap:sessions:cancel'),
  sessionsCommand: invoke<(id: string, cmd: string) => Promise<void>>()('ap:sessions:command'),
  sessionsLog: invoke<(id: string) => Promise<HostLogLine[]>>()('ap:sessions:log'),
  sessionsRemove: invoke<(id: string) => Promise<void>>()('ap:sessions:remove'),
  sessionsShowJob: invoke<(id: string) => Promise<void>>()('ap:sessions:showJob'),
  serversList: invoke<() => Promise<ServerEntry[]>>()('ap:servers:list'),
  serversSave: invoke<(entry: ServerEntry) => Promise<ServerEntry>>()('ap:servers:save'),
  serversRemove: invoke<(id: string) => Promise<void>>()('ap:servers:remove'),
  serversTest: invoke<(id: string) => Promise<ServerTestResult>>()('ap:servers:test'),
  serversTrustKey: invoke<(id: string, sha256: string) => Promise<ServerEntry>>()('ap:servers:trustKey'),
  ggOpenRooms: invoke<(baseUrl: string) => Promise<void>>()('ap:gg:openRooms'),
  lobbyServerStatus: invoke<() => Promise<LobbyServerStatus>>()('ap:lobby:serverStatus'),
  lobbyServerApply: invoke<(options: LobbyServerOptions) => Promise<LobbyServerStatus>>()('ap:lobby:serverApply'),
  lobbyServerView: invoke<(serverId: string) => Promise<LobbyServerView>>()('ap:lobby:serverView'),
  lobbyList: invoke<(serverId: string) => Promise<AdminLobby[]>>()('ap:lobby:list'),
  lobbyAct: invoke<(serverId: string, request: LobbyRequest) => Promise<AdminLobby>>()('ap:lobby:act'),
  lobbyServersList: invoke<() => Promise<LobbyServerEntry[]>>()('ap:lobby:servers'),
  lobbyServersSave: invoke<(entry: LobbyServerEntry) => Promise<LobbyServerEntry>>()('ap:lobby:serversSave'),
  lobbyServersRemove: invoke<(id: string) => Promise<void>>()('ap:lobby:serversRemove'),
  lobbyServersTest: invoke<(id: string) => Promise<LobbyServerTest>>()('ap:lobby:serversTest'),
  lanBrowse: invoke<(on: boolean) => Promise<LanEntry[]>>()('ap:lan:browse'),
  lobbyReviewPlay: invoke<(request: LobbyReviewPlay) => Promise<{ ok: boolean; failure?: string }>>()('ap:lobby:reviewPlay'),
  lobbyReviewHostDone: invoke<(id: number) => Promise<void>>()('ap:lobby:reviewHostDone'),
  onEngineEvent: event<(event: EngineEvent) => void>()('ap:engine:event'),
  onSessionEvent: event<(event: SessionEvent) => void>()('ap:sessions:event'),
  onLobbyEvent: event<(event: LobbyEvent) => void>()('ap:lobby:event'),
  onLanServers: event<(servers: LanEntry[]) => void>()('ap:lan:servers'),
  onLobbyReviewHost: event<(host: LobbyReviewHost) => void>()('ap:lobby:reviewHost'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP };
