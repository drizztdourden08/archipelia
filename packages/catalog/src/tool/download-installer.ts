/* @layer core @kind logic */
import type { Fetch } from '../install/fetch-file.type';
import { DOWNLOAD_TIMEOUT_MS, MAX_HOPS } from './tool.constants';
import type { Download } from './tool.type';
import { TOOL_TEXT } from './tool-text.constants';

const isAllowed = (url: URL, hosts: readonly string[]): boolean =>
  url.protocol === 'https:' && url.username === '' && url.password === '' && hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));

const nextOf = (res: Response, from: URL): string | undefined => {
  const location = res.headers.get('location');
  return location === null ? undefined : new URL(location, from).href;
};

const readCapped = async (res: Response, maxBytes: number): Promise<Uint8Array> => {
  const reader: ReadableStreamDefaultReader<Uint8Array> | undefined = res.body?.getReader();
  if (!reader) return new Uint8Array();
  if (Number(res.headers.get('content-length') ?? 0) > maxBytes) {
    await reader.cancel();
    throw new Error(TOOL_TEXT.tooLarge);
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (let read = await reader.read(); !read.done; read = await reader.read()) {
    size += read.value.length;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error(TOOL_TEXT.tooLarge);
    }
    chunks.push(read.value);
  }
  return new Uint8Array(Buffer.concat(chunks));
};

const downloadInstaller = async (request: Fetch, { url, hosts, maxBytes }: Download): Promise<Uint8Array> => {
  let next: string | undefined = url;
  for (let hop = 0; hop <= MAX_HOPS && next !== undefined; hop += 1) {
    const target = new URL(next);
    if (!isAllowed(target, hosts)) throw new Error(TOOL_TEXT.host);
    const res = await request(target, { redirect: 'manual', headers: { 'user-agent': 'Archipelia' }, signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
    if (res.status >= 300 && res.status < 400) {
      await res.body?.cancel();
      next = nextOf(res, target);
      continue;
    }
    if (!res.ok) {
      await res.body?.cancel();
      throw new Error(TOOL_TEXT.download);
    }
    return readCapped(res, maxBytes);
  }
  throw new Error(TOOL_TEXT.hops);
};

export { downloadInstaller };
