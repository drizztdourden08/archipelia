/* @layer protocol @kind logic */
import type { DiscoveryBeacon } from './discovery.type';
import { BEACON_APP, BEACON_MAX_BYTES } from './discovery.constants';

const buildBeacon = (beacon: DiscoveryBeacon): string => {
  const text = JSON.stringify({
    app: BEACON_APP,
    name: beacon.name,
    id: beacon.id,
    protocol: beacon.protocol,
    ap: beacon.ap,
    open: beacon.open,
    port: beacon.port,
  });
  if (new TextEncoder().encode(text).length > BEACON_MAX_BYTES) {
    throw new Error(`the beacon is larger than ${BEACON_MAX_BYTES} bytes`);
  }
  return text;
};

export { buildBeacon };
