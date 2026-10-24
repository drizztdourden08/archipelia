/* @layer core @kind logic */
import type { DiscoveryRecord } from '@drizztdourden08/archipelia-lobby-protocol';
import { PROTOCOL_VERSION } from '@drizztdourden08/archipelia-lobby-protocol';
import type { ReachInput } from './reach.type';
import { UNKNOWN_AP } from './reach.constants';

const discoveryRecord = async (input: ReachInput): Promise<DiscoveryRecord> => {
  const open = (await input.lobbies()).filter((lobby) => lobby.phase === 'open');
  const ap = open[0]?.engine.ap ?? (await input.fallbackAp()) ?? UNKNOWN_AP;
  return { name: input.server.name, id: input.server.id, protocol: PROTOCOL_VERSION, ap, open: open.length > 0 };
};

export { discoveryRecord };
