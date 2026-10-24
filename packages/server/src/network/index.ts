/* @layer core @kind barrel */
export { startAdvertiser } from './discovery/start-advertiser';
export { startBrowser } from './discovery/start-browser';
export type { AdvertiseHandle, AdvertiseOptions } from './discovery/advertise.type';
export type { BrowseHandle, BrowseOptions, DiscoverySource, LanServer } from './discovery/browse.type';
export { mapPort } from './mapping/map-port';
export { createNodeMappingPorts } from './mapping/create-node-mapping-ports';
export { createPublicLookup } from './mapping/create-public-lookup';
export type { LookupOutcome, PublicLookup, PublicLookupFetch, PublicLookupOptions } from './mapping/public-lookup.type';
export type {
  CgnatKind,
  CgnatReport,
  ExternalAddress,
  MapAttempt,
  MapMethod,
  MapPortOptions,
  MapProtocol,
  MappingPorts,
  MappingState,
  PortMapResult,
  UpnpClientLike,
} from './mapping/mapping.type';
export { DEFAULT_NETWORK_MODE, NETWORK_MODE_LABELS, NETWORK_MODES } from './mode/network-mode.constants';
export { isNetworkMode } from './mode/is-network-mode';
export type { NetworkMode } from './mode/network-mode.type';
export { wantsDiscovery } from './mode/wants-discovery';
export { wantsPortMapping } from './mode/wants-port-mapping';
export { createNodeNetworkPorts } from './ports/create-node-network-ports';
export type { LanInterface, MdnsPort, MdnsQuestion, MdnsRecord, NetworkPorts, UdpEndpoint, UdpOptions, UdpPeer } from './ports/network-ports.type';
