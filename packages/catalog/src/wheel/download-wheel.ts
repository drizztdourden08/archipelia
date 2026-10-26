/* @layer core @kind logic */
import { createHash, randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import type { Fetch } from '../install/fetch-file.type';
import type { DownloadLimits, WheelDownload, WheelSite } from './wheel.type';
import { fetchReleaseAsset } from './fetch-release-asset';
import { MAX_WHEEL_BYTES, PART_SUFFIX } from './wheel.constants';

const urlOf = ({ owner, repo, tag, asset }: WheelSite) =>
  `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

const downloadWheel = async (site: WheelSite, request: Fetch, { dir, size, expected }: DownloadLimits): Promise<WheelDownload> => {
  const res = await fetchReleaseAsset(urlOf(site), request);
  if (!res.ok || !res.body) throw new Error(`GitHub answered ${res.status} for ${site.asset}.`);
  if (Number(res.headers.get('content-length') ?? 0) > MAX_WHEEL_BYTES) throw new Error(`${site.asset} is larger than Archipelia takes.`);
  await mkdir(dir, { recursive: true });
  const file = join(dir, `${randomUUID()}${PART_SUFFIX}`);
  const hash = createHash('sha256');
  let total = 0;
  const counted = async function* (source: AsyncIterable<Uint8Array>) {
    for await (const chunk of source) {
      total += chunk.length;
      if (total > MAX_WHEEL_BYTES) throw new Error(`${site.asset} is larger than Archipelia takes.`);
      hash.update(chunk);
      yield chunk;
    }
  };
  try {
    await pipeline(Readable.fromWeb(res.body as ReadableStream<Uint8Array>), counted, createWriteStream(file));
    const sha256 = hash.digest('hex');
    if (size !== undefined && total !== size) throw new Error(`${site.asset} is ${total} bytes, the release says ${size}.`);
    if (expected !== undefined && sha256 !== expected) throw new Error(`${site.asset} does not match the checksum on record. Nothing was installed.`);
    return { file, sha256 };
  } catch (err) {
    await rm(file, { force: true });
    throw err;
  }
};

export { downloadWheel };
