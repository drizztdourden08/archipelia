/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { access, mkdir, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const sha256Of = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');

const exists = (file) => access(file).then(() => true, () => false);

const downloadTo = async (url, file, sha256, signal) => {
  if (!(await exists(file))) {
    await mkdir(dirname(file), { recursive: true });
    const res = await fetch(url, { signal });
    if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(`${file}.part`));
    await rename(`${file}.part`, file);
  }
  if (sha256 && (await sha256Of(file)) !== sha256) {
    await rm(file, { force: true });
    throw new Error(`${file}: sha256 mismatch`);
  }
  return file;
};

export { downloadTo, exists };
