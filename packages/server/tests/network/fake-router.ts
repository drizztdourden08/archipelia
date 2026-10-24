/* @layer tests @kind test */
import type { UpnpClientLike } from '../../src/network';
import type { GatewayReply } from './fake-network';

type RouterSpec = {
  address?: string;
  externalIp: string;
  pcp?: boolean;
  natpmp?: boolean;
  code?: number;
  answering?: () => boolean;
};

type RouterRequest = {
  kind: 'pcp' | 'natpmp-map' | 'natpmp-address';
  internal: number;
  external: number;
  lifetime: number;
  nonce?: number[];
};

const GATEWAY = '192.168.1.1';
const PCP_UNSUPPORTED = new Uint8Array([0, 129, 0, 1, 0, 0, 0, 0]);

const ipBytes = (ip: string): number[] => ip.split('.').map(Number);

const viewOf = (data: Uint8Array): DataView => new DataView(data.buffer, data.byteOffset, data.byteLength);

const natpmpMapReply = (data: Uint8Array, code: number): Uint8Array => {
  const asked = viewOf(data);
  const out = new Uint8Array(16);
  const view = viewOf(out);
  const lifetime = asked.getUint32(8);
  view.setUint8(1, 128 + (data[1] ?? 0));
  view.setUint16(2, code);
  view.setUint16(8, asked.getUint16(4));
  view.setUint16(10, lifetime === 0 ? 0 : asked.getUint16(6) || asked.getUint16(4));
  view.setUint32(12, lifetime);
  return out;
};

const pcpReply = (data: Uint8Array, ip: string, code: number): Uint8Array => {
  const out = new Uint8Array(data);
  out[1] = 0x81;
  out[3] = code;
  out.fill(0, 8, 24);
  out.fill(0, 44, 60);
  const view = viewOf(out);
  const asked = viewOf(data);
  view.setUint16(42, asked.getUint16(42) || asked.getUint16(40));
  view.setUint16(54, 0xffff);
  out.set(ipBytes(ip), 56);
  return out;
};

const createFakeRouter = (spec: RouterSpec) => {
  const requests: RouterRequest[] = [];
  const code = spec.code ?? 0;

  const answerPcp = (data: Uint8Array): Uint8Array => {
    if (!spec.pcp) return PCP_UNSUPPORTED;
    const view = viewOf(data);
    requests.push({ kind: 'pcp', internal: view.getUint16(40), external: view.getUint16(42), lifetime: view.getUint32(4), nonce: [...data.slice(24, 36)] });
    return pcpReply(data, spec.externalIp, code);
  };

  const answerNatpmp = (data: Uint8Array): Uint8Array | null => {
    if (!spec.natpmp) return null;
    if (data.length === 2) {
      requests.push({ kind: 'natpmp-address', internal: 0, external: 0, lifetime: 0 });
      return new Uint8Array([0, 128, 0, code, 0, 0, 0, 0, ...ipBytes(spec.externalIp)]);
    }
    const view = viewOf(data);
    requests.push({ kind: 'natpmp-map', internal: view.getUint16(4), external: view.getUint16(6), lifetime: view.getUint32(8) });
    return natpmpMapReply(data, code);
  };

  const reply: GatewayReply = (data, port, address) => {
    const listening = address === (spec.address ?? GATEWAY) && port === 5351 && spec.answering?.() !== false;
    if (!listening) return null;
    return data[0] === 2 && data.length === 60 ? answerPcp(data) : answerNatpmp(data);
  };
  return { reply, requests };
};

type UpnpSpec = { publicIp?: string; permanentOnly?: boolean; fault?: number; silent?: boolean };

const upnpFault = (code: number): Error => Object.assign(new Error(`fault ${code}`), { code });

const createFakeUpnp = ({ publicIp = '203.0.113.9', permanentOnly = false, fault, silent = false }: UpnpSpec = {}) => {
  const calls: string[] = [];
  let created = 0;
  const client: UpnpClientLike = {
    createMapping: (options) => {
      calls.push(`create ${options.protocol} ${options.public} ttl ${options.ttl}`);
      if (silent) return Promise.reject(new Error('timeout'));
      if (fault !== undefined) return Promise.reject(upnpFault(fault));
      if (permanentOnly && options.ttl > 0) return Promise.reject(upnpFault(725));
      return Promise.resolve({});
    },
    removeMapping: (options) => {
      calls.push(`remove ${options.protocol} ${options.public}`);
      return Promise.resolve({});
    },
    getPublicIp: () => Promise.resolve(publicIp),
    close: () => { calls.push('close'); },
  };
  return { calls, create: () => { created += 1; return client; }, created: () => created };
};

export { createFakeRouter, createFakeUpnp };
