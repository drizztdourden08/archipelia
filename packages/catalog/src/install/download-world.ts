/* @layer core @kind logic */
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import { createWriteStream } from 'node:fs';
import type { DownloadedWorld, Fetch } from './fetch-file.type';

const downloadWorld = async (url: string, request: Fetch = fetch): Promise<DownloadedWorld> => {
  const res = await request(url, { redirect: 'follow' });
  if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`);
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-world-'));
  const dispose = () => rm(dir, { recursive: true, force: true });
  const file = join(dir, 'download.apworld');
  try {
    await pipeline(Readable.fromWeb(res.body as ReadableStream<Uint8Array>), createWriteStream(file));
  } catch (err) {
    await dispose();
    throw err;
  }
  return { file, dispose };
};

export { downloadWorld };
