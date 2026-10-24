/* @layer core @kind logic */
import { Client } from '@runonflux/nat-upnp';
import type { MappingPorts } from './mapping.type';
import { listLanInterfaces } from '../ports/list-lan-interfaces';
import { openNodeUdp } from '../ports/open-node-udp';
import { UPNP_TIMEOUT_MS } from './mapping.constants';
import { createPublicLookup } from './create-public-lookup';
import type { PublicLookup } from './public-lookup.type';

const createNodeMappingPorts = (lookup: PublicLookup | null = createPublicLookup()): MappingPorts => ({
  openUdp: openNodeUdp,
  interfaces: listLanInterfaces,
  createUpnp: () => new Client({ timeout: UPNP_TIMEOUT_MS }),
  ...(lookup ? { lookupPublicAddress: lookup.lookup } : {}),
});

export { createNodeMappingPorts };
