/* @layer protocol @kind types */
import type { LobbyBrowseReply, LobbyBrowseRequest } from './browse.type';
import type { Hello, LobbyInfoRequest } from './hello.type';
import type {
  AdmissionMessage,
  ErrorMessage,
  LobbyFailed,
  LobbyInfoReply,
  LobbyProgress,
  LobbyStarted,
  LobbyState,
  RoomStatus,
  Welcome,
} from './server.type';
import type {
  FileChunk,
  FileDone,
  FileGet,
  Leave,
  Ready,
  SlotsOk,
  SlotsSet,
  UploadBegin,
  UploadChunk,
  UploadDone,
  UploadReady,
} from './upload.type';

type ClientMessage = LobbyInfoRequest | LobbyBrowseRequest | Hello | Ready | Leave | SlotsSet | UploadBegin | UploadChunk | FileGet;

type ServerMessage =
  | LobbyInfoReply
  | LobbyBrowseReply
  | Welcome
  | ErrorMessage
  | AdmissionMessage
  | LobbyState
  | LobbyProgress
  | LobbyStarted
  | LobbyFailed
  | RoomStatus
  | SlotsOk
  | UploadReady
  | UploadDone
  | FileChunk
  | FileDone;

type ProtocolMessage = ClientMessage | ServerMessage;

type UnknownMessage = { type: string; [field: string]: unknown };

export type { ClientMessage, ProtocolMessage, ServerMessage, UnknownMessage };
