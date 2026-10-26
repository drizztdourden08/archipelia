/* @layer tests @kind fixture */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import type { EngineRuntime } from '@archipelia/model';

const TAGS = ['cp312-cp312-win_amd64', 'cp312-abi3-win_amd64', 'cp311-abi3-win_amd64', 'cp312-none-any', 'py3-none-any'];

type WheelParts = { name?: string; version?: string; requires?: string[]; modules?: string[] };

const wheelBytes = ({ name = 'ctrando', version = '1.2.0', requires = [], modules = ['ctrando'] }: WheelParts = {}): Uint8Array => {
  const info = `${name}-${version}.dist-info`;
  const headers = ['Metadata-Version: 2.1', `Name: ${name}`, `Version: ${version}`, ...requires.map((line) => `Requires-Dist: ${line}`)];
  return zipSync({
    [`${info}/METADATA`]: strToU8(headers.join('\n')),
    ...Object.fromEntries(modules.map((module) => [`${module}/__init__.py`, strToU8('')])),
  });
};

const sha256Of = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const assetJson = (name: string, bytes: Uint8Array, digest = true) => ({
  name, size: bytes.length, state: 'uploaded', digest: digest ? `sha256:${sha256Of(bytes)}` : null, browser_download_url: `https://evil.example/${name}`,
});

const releaseJson = (tag: string, assets: unknown[], patch: Record<string, unknown> = {}) => ({
  tag_name: tag, draft: false, prerelease: false, body: 'Download from https://evil.example/ctrando.whl', assets, ...patch,
});

const downloadUrl = (tag: string, asset: string) => `https://github.com/Pseudoarc/ctrando/releases/download/${tag}/${asset}`;

const cacheWheel = async (runtime: EngineRuntime, bytes: Uint8Array, label: { repo: string; tag: string; asset: string; verified: boolean }) => {
  const sha256 = sha256Of(bytes);
  const dir = join(runtime.root, 'wheels', sha256);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, label.asset), bytes);
  await writeFile(join(dir, 'source.json'), JSON.stringify(label));
  return { sha256, dir, file: join(dir, label.asset) };
};

const WHEEL = 'ctrando-1.2.0-cp312-cp312-win_amd64.whl';

export { assetJson, cacheWheel, downloadUrl, releaseJson, sha256Of, TAGS, WHEEL, wheelBytes };
