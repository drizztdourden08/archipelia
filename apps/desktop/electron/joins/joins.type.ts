/* @layer electron-main @kind types */
import type { ClientInfo, ProtocolMessage } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Transport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { DataFiles, InstalledGame } from '@archipelia/model';
import type { Core } from '@archipelia/server';
import type { PlayerSources } from '@archipelia/sessions/players';
import type { JoinState, JoinView } from '../../src/joins/joins.type';

type LinkMessage = ProtocolMessage;

type Waiter = { match: (message: LinkMessage) => boolean; resolve: (message: LinkMessage) => void; reject: (error: Error) => void };

type LobbyLink = {
  send: (message: Record<string, unknown>) => void;
  request: (message: Record<string, unknown>) => Promise<LinkMessage>;
  stream: (message: Record<string, unknown>, isEnd: (message: LinkMessage) => boolean) => Promise<LinkMessage[]>;
  waitFor: (match: (message: LinkMessage) => boolean, timeoutMs: number) => Promise<LinkMessage>;
  onMessage: (listener: (message: LinkMessage) => void) => () => void;
  onClose: (listener: (code: number) => void) => void;
  close: (code?: number) => void;
};

type JoinWorld = { module: string; worldVersion: string; sha256: string; size: number; path: string };

type JoinYaml = { text: string; sha256: string; size: number };

type JoinRecord = JoinView & { memberId?: string; token?: string; yaml: JoinYaml; world?: JoinWorld };

type JoinDeps = {
  files: DataFiles;
  connect: (address: string) => Promise<Transport>;
  readWorld: (path: string) => Promise<Uint8Array>;
  client: ClientInfo;
  engineAp: () => Promise<string | undefined>;
  emit: (view: JoinView) => void;
  now?: () => number;
};

type JoinStop = Error & { state: JoinState; forget: boolean };

type JoinRun = {
  link: LobbyLink;
  files: DataFiles;
  current: () => JoinRecord;
  save: (patch: Partial<JoinRecord>) => Promise<JoinRecord>;
  flags: { uploaded: boolean; readySent: boolean };
};

type JoinBook = {
  list: () => Promise<JoinRecord[]>;
  get: (id: string) => Promise<JoinRecord | undefined>;
  put: (record: JoinRecord) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

type JoinContext = { deps: JoinDeps; book: JoinBook; live: Map<string, LobbyLink>; now: () => number };

type RecordDeps = {
  installed: () => Promise<InstalledGame[]>;
  presets: PlayerSources['presets'];
  worldPath: (game: InstalledGame) => Promise<string>;
  readWorld: (path: string) => Promise<Uint8Array>;
  now: number;
};

type JoinServicesDeps = { core: Core; files: DataFiles; name: string; version: string; emit: (view: JoinView) => void; log: (message: string) => void };

type JoinHandlers = { [Type in LinkMessage['type']]?: (run: JoinRun, message: Extract<LinkMessage, { type: Type }>) => Promise<unknown> };

type UploadFile = { sha256: string; kind: 'world' | 'yaml'; bytes: () => Promise<Uint8Array> };

export type { JoinContext, JoinDeps, JoinHandlers, JoinRecord, JoinRun, JoinServicesDeps, JoinStop, RecordDeps, JoinWorld, LinkMessage, LobbyLink, UploadFile, Waiter };
