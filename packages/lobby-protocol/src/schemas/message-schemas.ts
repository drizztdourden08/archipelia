/* @layer protocol @kind data */
import {
  FILE_GET_SCHEMA,
  HELLO_SCHEMA,
  LEAVE_SCHEMA,
  LOBBY_INFO_SCHEMA,
  READY_SCHEMA,
  SLOTS_SET_SCHEMA,
  UPLOAD_BEGIN_SCHEMA,
  UPLOAD_CHUNK_SCHEMA,
} from './client-schemas';
import { ADMISSION_SCHEMA, ERROR_SCHEMA, LOBBY_INFO_REPLY_SCHEMA, WELCOME_SCHEMA } from './handshake-schemas';
import {
  LOBBY_FAILED_SCHEMA,
  LOBBY_PROGRESS_SCHEMA,
  LOBBY_STARTED_SCHEMA,
  LOBBY_STATE_SCHEMA,
  ROOM_STATUS_SCHEMA,
} from './lobby-schemas';
import {
  FILE_CHUNK_SCHEMA,
  FILE_DONE_SCHEMA,
  SLOTS_OK_SCHEMA,
  UPLOAD_DONE_SCHEMA,
  UPLOAD_READY_SCHEMA,
} from './transfer-schemas';

const CLIENT_SCHEMAS = {
  'lobby.info': LOBBY_INFO_SCHEMA,
  hello: HELLO_SCHEMA,
  ready: READY_SCHEMA,
  leave: LEAVE_SCHEMA,
  'slots.set': SLOTS_SET_SCHEMA,
  'upload.begin': UPLOAD_BEGIN_SCHEMA,
  'upload.chunk': UPLOAD_CHUNK_SCHEMA,
  'file.get': FILE_GET_SCHEMA,
};

const SERVER_SCHEMAS = {
  'lobby.info.reply': LOBBY_INFO_REPLY_SCHEMA,
  welcome: WELCOME_SCHEMA,
  error: ERROR_SCHEMA,
  admission: ADMISSION_SCHEMA,
  'lobby.state': LOBBY_STATE_SCHEMA,
  'lobby.progress': LOBBY_PROGRESS_SCHEMA,
  'lobby.started': LOBBY_STARTED_SCHEMA,
  'lobby.failed': LOBBY_FAILED_SCHEMA,
  'room.status': ROOM_STATUS_SCHEMA,
  'slots.ok': SLOTS_OK_SCHEMA,
  'upload.ready': UPLOAD_READY_SCHEMA,
  'upload.done': UPLOAD_DONE_SCHEMA,
  'file.chunk': FILE_CHUNK_SCHEMA,
  'file.done': FILE_DONE_SCHEMA,
};

export { CLIENT_SCHEMAS, SERVER_SCHEMAS };
