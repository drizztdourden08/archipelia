/* @layer renderer-app @kind types */
import type { EventContract, InvokeContract } from '@drizztdourden08/brock-core/augment';
import type { EventApi, InvokeApi } from '@drizztdourden08/brock-core/ipc';
import type {
  CatalogEntry, EngineStatus, GamePreset, InstalledGame, ServerEntry, ServerTest, Session, SessionTemplate,
} from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';
import type { PresetInput } from '@archipelia/presets';
import type { SessionEvent } from '@archipelia/sessions';
import type { ARCHIPELIA_EVENT_MAP, ARCHIPELIA_INVOKE_MAP } from './contract.constants';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'ap:engine:status': () => Promise<EngineStatus>;
    'ap:engine:setup': () => Promise<EngineStatus>;
    'ap:catalog:read': (refresh: boolean) => Promise<CatalogView>;
    'ap:catalog:official': () => Promise<CatalogEntry[]>;
    'ap:games:list': () => Promise<InstalledGame[]>;
    'ap:games:install': (request: InstallRequest) => Promise<InstalledGame>;
    'ap:games:remove': (apworld: string) => Promise<void>;
    'ap:presets:list': () => Promise<GamePreset[]>;
    'ap:presets:create': (preset: PresetInput) => Promise<GamePreset>;
    'ap:presets:save': (preset: GamePreset) => Promise<GamePreset>;
    'ap:presets:duplicate': (id: string, name: string) => Promise<GamePreset>;
    'ap:presets:remove': (id: string) => Promise<void>;
    'ap:templates:list': () => Promise<SessionTemplate[]>;
    'ap:templates:save': (template: SessionTemplate) => Promise<SessionTemplate>;
    'ap:templates:remove': (id: string) => Promise<void>;
    'ap:sessions:list': () => Promise<Session[]>;
    'ap:sessions:run': (template: SessionTemplate) => Promise<Session>;
    'ap:sessions:stop': (id: string) => Promise<Session | undefined>;
    'ap:sessions:cancel': (id: string) => Promise<void>;
    'ap:sessions:command': (id: string, cmd: string) => Promise<void>;
    'ap:sessions:log': (id: string) => Promise<HostLogLine[]>;
    'ap:sessions:readText': (id: string, file: string) => Promise<string | null>;
    'ap:sessions:remove': (id: string) => Promise<void>;
    'ap:servers:list': () => Promise<ServerEntry[]>;
    'ap:servers:save': (entry: ServerEntry) => Promise<ServerEntry>;
    'ap:servers:remove': (id: string) => Promise<void>;
    'ap:servers:test': (id: string) => Promise<ServerTestResult>;
    'ap:servers:trustKey': (id: string, sha256: string) => Promise<ServerEntry>;
    'ap:gg:openRooms': (baseUrl: string) => Promise<void>;
    'ap:data:export': () => Promise<Uint8Array>;
    'ap:data:import': (bytes: Uint8Array) => Promise<DataImportResult>;
  }

  interface IpcNamespaces {
    archipelia: ArchipeliaApi;
  }

  interface EventContract {
    'ap:sessions:event': (event: SessionEvent) => void;
    'ap:engine:progress': (line: string) => void;
  }
}

type CatalogView = { apVersion: string; entries: CatalogEntry[]; problems: number; fetchedAt: number };

type InstallRequest =
  | { kind: 'index'; apworld: string; version: string }
  | { kind: 'official'; apworld: string }
  | { kind: 'file'; fileName: string; bytes: Uint8Array };

type DataImportResult = { presets: number; templates: number };

type ServerTestResult = ServerTest & { hostKey?: string };

type ArchipeliaApi = InvokeApi<typeof ARCHIPELIA_INVOKE_MAP> & EventApi<typeof ARCHIPELIA_EVENT_MAP>;

export type { ArchipeliaApi, CatalogView, EventContract, InstallRequest, InvokeContract, ServerTestResult };
