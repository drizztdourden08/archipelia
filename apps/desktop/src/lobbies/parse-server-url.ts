/* @layer renderer-app @kind logic */
import { DEFAULT_PORT } from '@drizztdourden08/archipelia-lobby-protocol';
import { AUTHORITY, BRACKETS, MAX_PORT, WRITTEN_PORT } from './lobbies.constants';
import type { ServerTarget } from './lobbies.type';

const portOf = (text: string): number => {
  const authority = AUTHORITY.exec(text)?.[1] ?? '';
  const written = WRITTEN_PORT.exec(authority)?.[1];
  return written === undefined ? DEFAULT_PORT : Number(written);
};

const parseServerUrl = (value: string): ServerTarget | null => {
  const text = value.trim();
  try {
    const url = new URL(text);
    const port = portOf(text);
    if ((url.protocol !== 'ws:' && url.protocol !== 'wss:') || url.hostname === '' || port < 1 || port > MAX_PORT) return null;
    return { secure: url.protocol === 'wss:', host: url.hostname.replace(BRACKETS, ''), port };
  } catch {
    return null;
  }
};

export { parseServerUrl };
