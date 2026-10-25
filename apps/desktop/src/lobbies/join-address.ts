/* @layer renderer-app @kind logic */
import { DEFAULT_PORT } from '@drizztdourden08/archipelia-lobby-protocol';
import { BRACKETS, LOOPBACK_HOST, MAX_PORT, NEEDS_WSS, NOT_A_JOIN_ADDRESS, PRIVATE_HOST, SCHEME } from './lobbies.constants';
import type { JoinAddress, ServerTarget } from './lobbies.type';

const privateHost = (host: string): boolean => LOOPBACK_HOST.test(host) || PRIVATE_HOST.test(host);

const targetOf = (url: URL, written: boolean): ServerTarget | null => {
  const host = url.hostname.replace(BRACKETS, '');
  const port = url.port === '' ? DEFAULT_PORT : Number(url.port);
  const known = url.protocol === 'ws:' || url.protocol === 'wss:';
  if (!known || host === '' || port < 1 || port > MAX_PORT) return null;
  return { secure: url.protocol === 'wss:' || (!written && !privateHost(host)), host, port };
};

const urlOf = (text: string, written: boolean): URL | null => {
  try {
    return new URL(written ? text : `ws://${text}`);
  } catch {
    return null;
  }
};

const joinAddress = (value: string): JoinAddress => {
  const text = value.trim();
  const written = SCHEME.test(text);
  const url = text === '' ? null : urlOf(text, written);
  const target = url ? targetOf(url, written) : null;
  if (!target) return { problem: NOT_A_JOIN_ADDRESS };
  return target.secure || privateHost(target.host) ? { target } : { problem: NEEDS_WSS };
};

export { joinAddress };
