/* @layer core @kind logic */
import type { PcpAnswer, PcpMappingRequest } from './pcp.type';
import { gatewayCandidates } from '../gateway-candidates';
import { localAddressFor } from '../local-address-for';
import { udpExchange } from '../udp-exchange';
import { buildPcpMapRequest } from './build-pcp-map-request';
import { readPcpMapping } from './read-pcp-mapping';

const requestPcpMapping = async ({ ports, gateways, nonce, protocol, port, externalPort, lifetime }: PcpMappingRequest): Promise<PcpAnswer | null> => {
  const interfaces = ports.interfaces();
  const answer = await udpExchange({
    ports,
    gateways: gateways ?? gatewayCandidates(interfaces),
    payloadFor: (gateway) => {
      const clientAddress = localAddressFor(interfaces, gateway);
      return clientAddress ? buildPcpMapRequest({ clientAddress, nonce, protocol, internalPort: port, externalPort, lifetime }) : null;
    },
    accept: (data) => readPcpMapping(data, nonce, protocol, port) !== null,
  });
  const mapping = answer ? readPcpMapping(answer.data, nonce, protocol, port) : null;
  return answer && mapping ? { gateway: answer.gateway, mapping } : null;
};

export { requestPcpMapping };
