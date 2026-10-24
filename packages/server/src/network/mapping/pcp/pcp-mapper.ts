/* @layer core @kind logic */
import { randomBytes } from 'node:crypto';
import type { Mapper, MapperOutcome, MapRequest } from '../mapping.type';
import { describePcpFault } from './describe-pcp-fault';
import { NONCE_BYTES, PCP_NO_ANSWER, UNSUPPORTED_VERSION } from './pcp.constants';
import { requestPcpMapping } from './request-pcp-mapping';

const open = async ({ ports, port, protocol, ttl }: MapRequest): Promise<MapperOutcome> => {
  const nonce = new Uint8Array(randomBytes(NONCE_BYTES));
  const first = await requestPcpMapping({ ports, gateways: null, nonce, protocol, port, externalPort: port, lifetime: ttl });
  if (!first) return { ok: false, kind: 'absent', detail: PCP_NO_ANSWER };
  const { gateway, mapping } = first;
  if (!mapping.ok) {
    return { ok: false, kind: mapping.code === UNSUPPORTED_VERSION ? 'absent' : 'refused', detail: describePcpFault(mapping.code) };
  }
  let external = { address: mapping.externalAddress, port: mapping.externalPort };
  return {
    ok: true,
    session: {
      external,
      lifetime: mapping.lifetime,
      renew: async () => {
        const again = await requestPcpMapping({ ports, gateways: [gateway], nonce, protocol, port, externalPort: external.port, lifetime: ttl });
        if (!again) return { ok: false, detail: PCP_NO_ANSWER };
        if (!again.mapping.ok) return { ok: false, detail: describePcpFault(again.mapping.code) };
        external = { address: again.mapping.externalAddress ?? external.address, port: again.mapping.externalPort };
        return { ok: true, external, lifetime: again.mapping.lifetime };
      },
      release: async () => {
        await requestPcpMapping({ ports, gateways: [gateway], nonce, protocol, port, externalPort: external.port, lifetime: 0 });
      },
    },
  };
};

const pcpMapper: Mapper = { method: 'pcp', open };

export { pcpMapper };
