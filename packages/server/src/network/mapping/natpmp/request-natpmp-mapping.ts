/* @layer core @kind logic */
import type { NatpmpMapping, NatpmpMappingRequest } from './natpmp.type';
import { udpExchange } from '../udp-exchange';
import { buildNatpmpMapRequest } from './build-natpmp-map-request';
import { readNatpmpMapping } from './read-natpmp-mapping';

const requestNatpmpMapping = async ({ ports, gateway, protocol, port, externalPort, lifetime }: NatpmpMappingRequest): Promise<NatpmpMapping | null> => {
  const answer = await udpExchange({
    ports,
    gateways: [gateway],
    payloadFor: () => buildNatpmpMapRequest(protocol, port, externalPort, lifetime),
    accept: (data) => readNatpmpMapping(data, protocol, port) !== null,
  });
  return answer ? readNatpmpMapping(answer.data, protocol, port) : null;
};

export { requestNatpmpMapping };
