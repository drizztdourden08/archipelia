/* @layer core @kind logic */
import type { NetworkPorts } from './network-ports.type';
import { createNodeMdns } from './create-node-mdns';
import { listLanInterfaces } from './list-lan-interfaces';
import { openNodeUdp } from './open-node-udp';

const createNodeNetworkPorts = (): NetworkPorts => ({
  openMdns: createNodeMdns,
  openUdp: openNodeUdp,
  interfaces: listLanInterfaces,
});

export { createNodeNetworkPorts };
