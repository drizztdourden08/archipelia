/* @layer renderer-app @kind config */
import type { EventContract, InvokeContract, SendContract } from './contract.type';

const APP_INVOKE_MAP = {
  engineStatus: 'ap:engine:status',
  engineSetup: 'ap:engine:setup',
  catalogRead: 'ap:catalog:read',
  catalogOfficial: 'ap:catalog:official',
  gamesList: 'ap:games:list',
  gamesInstall: 'ap:games:install',
  gamesRemove: 'ap:games:remove',
  presetsList: 'ap:presets:list',
  presetsCreate: 'ap:presets:create',
  presetsSave: 'ap:presets:save',
  presetsDuplicate: 'ap:presets:duplicate',
  presetsRemove: 'ap:presets:remove',
  templatesList: 'ap:templates:list',
  templatesSave: 'ap:templates:save',
  templatesRemove: 'ap:templates:remove',
  sessionsList: 'ap:sessions:list',
  sessionsRun: 'ap:sessions:run',
  sessionsStop: 'ap:sessions:stop',
  sessionsCancel: 'ap:sessions:cancel',
  sessionsCommand: 'ap:sessions:command',
  sessionsLog: 'ap:sessions:log',
  sessionsReadText: 'ap:sessions:readText',
  sessionsRemove: 'ap:sessions:remove',
  serversList: 'ap:servers:list',
  serversSave: 'ap:servers:save',
  serversRemove: 'ap:servers:remove',
  serversTest: 'ap:servers:test',
  serversTrustKey: 'ap:servers:trustKey',
  ggOpenRooms: 'ap:gg:openRooms',
  dataExport: 'ap:data:export',
  dataImport: 'ap:data:import',
} as const satisfies Record<string, keyof InvokeContract>;

const APP_SEND_MAP = {} as const satisfies Record<string, keyof SendContract>;

const APP_EVENT_MAP = {
  onSessionEvent: 'ap:sessions:event',
  onEngineProgress: 'ap:engine:progress',
} as const satisfies Record<string, keyof EventContract>;

export { APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP };
