/* @layer core @kind logic */
import type { AdvertiseHandle, PortMapResult } from '../../network';
import { mapPort, startAdvertiser, wantsDiscovery, wantsPortMapping } from '../../network';
import { discoveryRecord } from './discovery-record';
import { mapRooms } from './map-rooms';
import { MAP_TTL_S } from './reach.constants';
import type { ReachInput, ReachStatus } from './reach.type';

const startReach = async (input: ReachInput) => {
  const rooms: Record<string, string> = {};
  const first = await discoveryRecord(input);
  const advertiser: AdvertiseHandle | null = wantsDiscovery(input.mode)
    ? await startAdvertiser({ record: first, port: input.port, automation: input.automation, ports: input.ports.network, onError: (error) => input.log(`LAN discovery: ${error.message}`) })
    : null;
  const mapping = wantsPortMapping(input.mode) ? mapRooms(input, rooms) : null;
  let lobbyPort: PortMapResult | null = null;
  if (wantsPortMapping(input.mode)) {
    lobbyPort = await mapPort({ port: input.port, protocol: 'tcp', ttl: MAP_TTL_S, automation: input.automation, ports: input.ports.mapping, description: 'Archipelia lobbies' });
    input.log(`lobby port ${input.port}: ${lobbyPort.message}`);
  }
  let announced = JSON.stringify(first);
  const announce = async () => {
    const record = await discoveryRecord(input);
    const key = JSON.stringify(record);
    if (key === announced) return;
    announced = key;
    advertiser?.update(record);
  };
  const unwatch = input.watch((lobby) => {
    mapping?.follow(lobby);
    if (advertiser) void announce().catch((error: unknown) => input.log(`LAN discovery: ${String(error)}`));
  });
  const status = (): ReachStatus => ({ mode: input.mode, advertising: advertiser?.active ?? false, lobbyPort: lobbyPort?.message ?? null, rooms: { ...rooms } });
  const stop = async () => {
    unwatch();
    await Promise.all([advertiser?.stop(), lobbyPort?.stop(), mapping?.stop()]);
  };
  return { status, stop };
};

export { startReach };
