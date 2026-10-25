/* @layer electron-main @kind logic */
import type { LobbyStarted } from '@drizztdourden08/archipelia-lobby-protocol';
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { JoinFile } from '../../src/joins/joins.type';
import { FILES_DIR, TEXT } from './joins.constants';
import type { JoinRun } from './joins.type';
import { joinStop } from './join-stop';

const fetchOne = async (run: JoinRun, fileId: string, name: string): Promise<string> => {
  const parts = await run.link.stream({ type: 'file.get', fileId }, (message) => message.type === 'file.done' || message.type === 'error');
  const chunks = parts.flatMap((part) => (part.type === 'file.chunk' ? [Buffer.from(part.data, 'base64')] : []));
  const last = parts.at(-1);
  if (last?.type === 'error') throw joinStop('failed', last.message);
  const bytes = new Uint8Array(Buffer.concat(chunks));
  if (last?.type !== 'file.done' || sha256Hex(bytes) !== last.sha256) throw joinStop('failed', TEXT.badFile);
  const rel = `${FILES_DIR}/${assertSafeName(run.current().id, 'join id')}/${assertSafeName(name, 'file name')}`;
  await run.files.writeBytes(rel, bytes);
  return run.files.path(rel);
};

const fetchFiles = async (run: JoinRun, started: LobbyStarted): Promise<JoinFile[]> => {
  const mine = started.slots.find((slot) => slot.name === run.current().slotName);
  const saved: JoinFile[] = [];
  for (const file of mine?.files ?? []) saved.push({ name: file.name, size: file.size, saved: await fetchOne(run, file.fileId, file.name) });
  return saved;
};

export { fetchFiles };
