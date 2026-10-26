/* @layer renderer-app @kind config */
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core';
import type { CatalogView, EnrichRequest, GameEnrichment, InstallRequest, PackagePreview } from '@archipelia/catalog';
import type {
  AdminLobby, CatalogEntry, EngineChoice, EngineEvent, EngineInstallResult, EngineOverview, EngineStatus, GamePreset,
  InstalledGame, LobbyServerEntry, PackageSource, ServerEntry, Session, SessionTemplate, SourcePlan, SourcePypiInstall, SourceRef, SourceSuggestions,
  SourceWheelRequest, StartupDecision, SuggestRequest,
} from '@archipelia/model';
import type { HostLogLine, ServerTestResult } from '@archipelia/hosts';
import type { PresetInput } from '@archipelia/presets';
import type { SessionEvent } from '@archipelia/sessions';
import type {
  LanEntry, LobbyEvent, LobbyProbe, LobbyRequest, LobbyReviewHost, LobbyReviewPlay, LobbyServerOptions, LobbyServerStatus, LobbyServerTest, LobbyServerView, PendingClose,
} from '../lobbies/lobbies.type';
import type { JoinRequest, JoinView } from '../joins/joins.type';

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
  catalogEnrich: invoke<(request: EnrichRequest) => Promise<GameEnrichment | undefined>>()('ap:catalog:enrich'),
  gamesList: invoke<() => Promise<InstalledGame[]>>()('ap:games:list'),
  gamesInstall: invoke<(request: InstallRequest) => Promise<InstalledGame>>()('ap:games:install'),
  gamesPackages: invoke<(request: InstallRequest) => Promise<PackagePreview>>()('ap:games:packages'),
  gamesRemove: invoke<(apworld: string) => Promise<void>>()('ap:games:remove'),
  sourcesSuggest: invoke<(request: SuggestRequest) => Promise<SourceSuggestions>>()('ap:sources:suggest'),
  sourcesPlan: invoke<(ref: SourceRef) => Promise<SourcePlan>>()('ap:sources:plan'),
  sourcesPypiPreview: invoke<(ref: SourceRef) => Promise<PackagePreview>>()('ap:sources:pypiPreview'),
  sourcesPypiInstall: invoke<(request: SourcePypiInstall) => Promise<void>>()('ap:sources:pypiInstall'),
  sourcesWheel: invoke<(request: SourceWheelRequest) => Promise<PackageSource>>()('ap:sources:wheel'),
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
  sessionsStart: invoke<(template: SessionTemplate) => Promise<AdminLobby>>()('ap:sessions:start'),
  sessionsRunLobby: invoke<(template: SessionTemplate) => Promise<AdminLobby>>()('ap:sessions:runLobby'),
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
  lobbyProbe: invoke<(address: string, code: string) => Promise<LobbyProbe>>()('ap:lobby:probe'),
  lobbyClose: invoke<(ref: PendingClose) => Promise<{ closed: boolean }>>()('ap:lobby:close'),
  lobbyPendingCloses: invoke<() => Promise<PendingClose[]>>()('ap:lobby:pendingCloses'),
  lobbyReviewPlay: invoke<(request: LobbyReviewPlay) => Promise<{ ok: boolean; failure?: string }>>()('ap:lobby:reviewPlay'),
  lobbyReviewHostDone: invoke<(id: number) => Promise<void>>()('ap:lobby:reviewHostDone'),
  joinsList: invoke<() => Promise<JoinView[]>>()('ap:joins:list'),
  joinsStart: invoke<(request: JoinRequest) => Promise<JoinView>>()('ap:joins:start'),
  joinsResume: invoke<(id: string) => Promise<JoinView>>()('ap:joins:resume'),
  joinsLeave: invoke<(id: string) => Promise<void>>()('ap:joins:leave'),
  joinsDismiss: invoke<(id: string) => Promise<void>>()('ap:joins:dismiss'),
  onEngineEvent: event<(event: EngineEvent) => void>()('ap:engine:event'),
  onSessionEvent: event<(event: SessionEvent) => void>()('ap:sessions:event'),
  onLobbyEvent: event<(event: LobbyEvent) => void>()('ap:lobby:event'),
  onLanServers: event<(servers: LanEntry[]) => void>()('ap:lan:servers'),
  onLobbyReviewHost: event<(host: LobbyReviewHost) => void>()('ap:lobby:reviewHost'),
  onJoinEvent: event<(view: JoinView) => void>()('ap:joins:event'),
  onPendingCloses: event<(pending: PendingClose[]) => void>()('ap:lobby:pendingCloses'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP };
