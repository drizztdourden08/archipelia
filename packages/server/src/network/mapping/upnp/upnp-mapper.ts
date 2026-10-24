/* @layer core @kind logic */
import type { ExternalAddress, Mapper, MapperOutcome, MapRequest } from '../mapping.type';
import { describeUpnpError } from './describe-upnp-error';
import { NO_GATEWAY, ONLY_PERMANENT_LEASES } from './upnp.constants';
import { upnpFaultCode } from './upnp-fault-code';

const publicAddressOf = async (client: ReturnType<MapRequest['ports']['createUpnp']>): Promise<string | null> => {
  try {
    return (await client.getPublicIp()) || null;
  } catch {
    return null;
  }
};

const open = async ({ ports, port, protocol, ttl, description }: MapRequest): Promise<MapperOutcome> => {
  const client = ports.createUpnp();
  const label = protocol.toUpperCase();
  const create = (lease: number) => client.createMapping({ public: port, private: port, protocol: label, description, ttl: lease });
  let lease = ttl;
  try {
    try {
      await create(lease);
    } catch (error) {
      if (upnpFaultCode(error) !== ONLY_PERMANENT_LEASES) throw error;
      lease = 0;
      await create(lease);
    }
  } catch (error) {
    client.close();
    return upnpFaultCode(error) === null
      ? { ok: false, kind: 'absent', detail: NO_GATEWAY }
      : { ok: false, kind: 'refused', detail: describeUpnpError(error) };
  }
  const external: ExternalAddress = { address: await publicAddressOf(client), port };
  return {
    ok: true,
    session: {
      external,
      lifetime: lease,
      renew: async () => {
        try {
          await create(lease);
          return { ok: true, external: { address: (await publicAddressOf(client)) ?? external.address, port }, lifetime: lease };
        } catch (error) {
          return { ok: false, detail: describeUpnpError(error) };
        }
      },
      release: async () => {
        try {
          await client.removeMapping({ public: port, protocol: label });
        } finally {
          client.close();
        }
      },
    },
  };
};

const upnpMapper: Mapper = { method: 'upnp', open };

export { upnpMapper };
