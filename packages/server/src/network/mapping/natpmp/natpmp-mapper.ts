/* @layer core @kind logic */
import type { Mapper, MapperOutcome, MapRequest } from '../mapping.type';
import { gatewayCandidates } from '../gateway-candidates';
import { udpExchange } from '../udp-exchange';
import { describeNatpmpFault } from './describe-natpmp-fault';
import { ADDRESS_REQUEST, NATPMP_NO_ANSWER, NATPMP_UNSUPPORTED_VERSION } from './natpmp.constants';
import { readNatpmpAddress } from './read-natpmp-address';
import { requestNatpmpMapping } from './request-natpmp-mapping';

const open = async ({ ports, port, protocol, ttl }: MapRequest): Promise<MapperOutcome> => {
  const found = await udpExchange({
    ports,
    gateways: gatewayCandidates(ports.interfaces()),
    payloadFor: () => ADDRESS_REQUEST,
    accept: (data) => readNatpmpAddress(data) !== null,
  });
  const address = found ? readNatpmpAddress(found.data) : null;
  if (!found || !address) return { ok: false, kind: 'absent', detail: NATPMP_NO_ANSWER };
  if (!address.ok) {
    const kind = address.code === NATPMP_UNSUPPORTED_VERSION ? 'absent' : 'refused';
    return { ok: false, kind, detail: describeNatpmpFault(address.code) };
  }
  const { gateway } = found;
  const mapped = await requestNatpmpMapping({ ports, gateway, protocol, port, externalPort: port, lifetime: ttl });
  if (!mapped) return { ok: false, kind: 'absent', detail: NATPMP_NO_ANSWER };
  if (!mapped.ok) return { ok: false, kind: 'refused', detail: describeNatpmpFault(mapped.code) };
  let externalPort = mapped.externalPort;
  return {
    ok: true,
    session: {
      external: { address: address.address, port: externalPort },
      lifetime: mapped.lifetime,
      renew: async () => {
        const again = await requestNatpmpMapping({ ports, gateway, protocol, port, externalPort, lifetime: ttl });
        if (!again) return { ok: false, detail: NATPMP_NO_ANSWER };
        if (!again.ok) return { ok: false, detail: describeNatpmpFault(again.code) };
        externalPort = again.externalPort;
        return { ok: true, external: { address: address.address, port: externalPort }, lifetime: again.lifetime };
      },
      release: async () => {
        await requestNatpmpMapping({ ports, gateway, protocol, port, externalPort: 0, lifetime: 0 });
      },
    },
  };
};

const natpmpMapper: Mapper = { method: 'nat-pmp', open };

export { natpmpMapper };
