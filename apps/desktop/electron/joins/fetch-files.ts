/* @layer electron-main @kind logic */
import type { LobbyStarted, StartedFile } from '@drizztdourden08/archipelia-lobby-protocol';
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { JoinFile } from '../../src/joins/joins.type';
import { FILES_DIR, MAX_FILE_BYTES, MAX_JOIN_FILE_BYTES, ROOM_FILE_NAME, TEXT } from './joins.constants';
import type { JoinRun, LinkMessage } from './joins.type';

const chunkBytes = (part: LinkMessage) => (part.type === 'file.chunk' ? Buffer.byteLength(part.data, 'base64') : 0);

const receive = async (run: JoinRun, file: StartedFile): Promise<Uint8Array | string> => {
  let received = 0;
  const accept = (part: LinkMessage) => {
    received += chunkBytes(part);
    return received <= file.size;
  };
  const parts = await run.link.stream({ type: 'file.get', fileId: file.fileId }, (message) => message.type === 'file.done' || message.type === 'error', accept)
    .catch(() => null);
  const last = parts?.at(-1);
  if (!parts || last?.type !== 'file.done') return TEXT.sizeMismatch;
  const bytes = new Uint8Array(Buffer.concat(parts.flatMap((part) => (part.type === 'file.chunk' ? [Buffer.from(part.data, 'base64')] : []))));
  if (bytes.length !== file.size) return TEXT.sizeMismatch;
  return sha256Hex(bytes) === last.sha256 ? bytes : TEXT.badFile;
};

const fetchOne = async (run: JoinRun, file: StartedFile, room: number): Promise<JoinFile> => {
  const base = { name: file.name, size: file.size };
  if (!ROOM_FILE_NAME.test(file.name)) return { ...base, refused: TEXT.badKind };
  if (file.size > MAX_FILE_BYTES || file.size > room) return { ...base, refused: TEXT.tooLarge };
  const bytes = await receive(run, file);
  if (typeof bytes === 'string') return { ...base, refused: bytes };
  const rel = `${FILES_DIR}/${assertSafeName(run.current().id, 'join id')}/${assertSafeName(file.name, 'file name')}`;
  await run.files.writeBytes(rel, bytes);
  return { ...base, saved: run.files.path(rel) };
};

const fetchFiles = async (run: JoinRun, started: LobbyStarted): Promise<JoinFile[]> => {
  const mine = started.slots.find((slot) => slot.name === run.current().slotName);
  const saved: JoinFile[] = [];
  let room = MAX_JOIN_FILE_BYTES;
  for (const file of mine?.files ?? []) {
    const result = await fetchOne(run, file, room);
    if (result.saved) room -= result.size;
    saved.push(result);
  }
  return saved;
};

export { fetchFiles };
