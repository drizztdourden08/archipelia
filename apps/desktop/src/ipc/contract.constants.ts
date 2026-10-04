/* @layer renderer-app @kind config */
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core';
import type { CatalogView, InstallRequest } from '@archipelia/catalog';
import type { CatalogEntry, EngineStatus, GamePreset, InstalledGame, ServerEntry, Session, SessionTemplate } from '@archipelia/model';
import type { HostLogLine, ServerTestResult } from '@archipelia/hosts';
import type { PresetInput } from '@archipelia/presets';
import type { SessionEvent } from '@archipelia/sessions';

const APP_CHANNELS = defineChannels({
  engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'),
  engineSetup: invoke<() => Promise<EngineStatus>>()('ap:engine:setup'),
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
  onSessionEvent: event<(event: SessionEvent) => void>()('ap:sessions:event'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP };
