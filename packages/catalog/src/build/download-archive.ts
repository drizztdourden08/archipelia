/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import type { Fetch } from '../install/fetch-file.type';
import type { Archive, ArchiveLimits, ArchiveSite } from './build.type';
import { archiveUrl } from './archive-url';
import { ARCHIVE_FILE, ARCHIVE_TIMEOUT_MS, MAX_ARCHIVE_BYTES } from './build.constants';

const tooLarge = (site: ArchiveSite) => new Error(`The source of ${site.owner}/${site.repo} is larger than Archipelia takes.`);

const downloadArchive = async (site: ArchiveSite, request: Fetch, { dir, signal }: ArchiveLimits): Promise<Archive> => {
  const res = await request(archiveUrl(site), {
    redirect: 'manual', headers: { 'user-agent': 'Archipelia' }, signal: AbortSignal.any([signal, AbortSignal.timeout(ARCHIVE_TIMEOUT_MS)]),
  });
  if (!res.ok || !res.body) throw new Error(`GitHub answered ${res.status} for the source of ${site.owner}/${site.repo}.`);
  if (Number(res.headers.get('content-length') ?? 0) > MAX_ARCHIVE_BYTES) throw tooLarge(site);
  const file = join(dir, ARCHIVE_FILE);
  const hash = createHash('sha256');
  let size = 0;
  const counted = async function* (source: AsyncIterable<Uint8Array>) {
    for await (const chunk of source) {
      size += chunk.length;
      if (size > MAX_ARCHIVE_BYTES) throw tooLarge(site);
      hash.update(chunk);
      yield chunk;
    }
  };
  await pipeline(Readable.fromWeb(res.body as ReadableStream<Uint8Array>), counted, createWriteStream(file));
  return { file, sha256: hash.digest('hex'), size };
};

export { downloadArchive };
