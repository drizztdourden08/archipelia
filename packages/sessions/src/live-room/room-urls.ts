/* @layer core @kind logic */
import type { Endpoint, HostTarget } from '@archipelia/model';
import { ANY_ADDRESS } from './room-target.constants';

const reachableHost = (host: string) => (ANY_ADDRESS.has(host) ? 'localhost' : host);

const roomUrls = (endpoint: Endpoint, host: HostTarget): string[] => {
  const address = `${reachableHost(endpoint.host)}:${endpoint.port}`;
  if (host.kind === 'local') return [`ws://${address}`];
  return [`wss://${address}`, `ws://${address}`];
};

export { roomUrls };
