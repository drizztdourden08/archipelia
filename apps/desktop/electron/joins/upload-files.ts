/* @layer electron-main @kind logic */
import { TEXT, UPLOAD_TIMEOUT_MS } from './joins.constants';
import type { LobbyLink, UploadFile } from './joins.type';
import { joinStop } from './join-stop';
import { replyTo } from './reply-to';

const uploadOne = async (link: LobbyLink, file: UploadFile, chunkBytes: number) => {
  const bytes = await file.bytes();
  const done = link.waitFor((message) => (message.type === 'upload.done' && message.sha256 === file.sha256) || (message.type === 'error' && replyTo(message) === undefined), UPLOAD_TIMEOUT_MS);
  done.catch(() => undefined);
  const ready = await link.request({ type: 'upload.begin', sha256: file.sha256, kind: file.kind, size: bytes.length });
  if (ready.type === 'error') throw joinStop('failed', ready.message);
  if (ready.type !== 'upload.ready') throw joinStop('failed', TEXT.noReply);
  for (let offset = ready.offset; offset < bytes.length; offset += chunkBytes) {
    link.send({ type: 'upload.chunk', sha256: file.sha256, offset, data: Buffer.from(bytes.subarray(offset, offset + chunkBytes)).toString('base64') });
  }
  const answer = await done;
  if (answer.type === 'error') throw joinStop('failed', answer.message);
  if (answer.type === 'upload.done' && !answer.ok) throw joinStop('failed', TEXT.uploadFailed);
};

const uploadFiles = async (link: LobbyLink, need: readonly string[], files: readonly UploadFile[], chunkBytes: number) => {
  for (const sha256 of need) {
    const file = files.find((candidate) => candidate.sha256 === sha256);
    if (file) await uploadOne(link, file, chunkBytes);
  }
};

export { uploadFiles };
