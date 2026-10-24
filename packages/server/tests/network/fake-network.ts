/* @layer tests @kind test */
import type {
  LanInterface,
  MdnsPort,
  MdnsQuestion,
  MdnsRecord,
  NetworkPorts,
  UdpEndpoint,
  UdpOptions,
  UdpPeer,
} from '../../src/network';

type Sent = { data: Uint8Array | string; port: number; address: string };

type FakeSocket = {
  options: UdpOptions;
  sent: Sent[];
  closed: boolean;
  deliver: (data: Uint8Array | string, from: UdpPeer) => void;
};

type FakeMdns = {
  port: MdnsPort;
  responses: MdnsRecord[][];
  queries: string[];
  closed: boolean;
  ask: (questions: MdnsQuestion[]) => void;
  hear: (records: MdnsRecord[], from: string) => void;
  fail: (error: Error) => void;
};

type GatewayReply = (data: Uint8Array, port: number, address: string) => Uint8Array | null;

type FakeNetworkOptions = {
  interfaces?: LanInterface[];
  refuseUdp?: (options: UdpOptions) => boolean;
  gateway?: GatewayReply;
};

const LAN: LanInterface[] = [{ address: '192.168.1.20', netmask: '255.255.255.0' }];

const need = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('expected a value');
  return value;
};

const asBytes = (data: Uint8Array | string): Uint8Array => (typeof data === 'string' ? new TextEncoder().encode(data) : data);

const createFakeNetwork = ({ interfaces = LAN, refuseUdp, gateway }: FakeNetworkOptions = {}) => {
  const sockets: FakeSocket[] = [];
  const mdnsPorts: FakeMdns[] = [];

  const openMdns = (): MdnsPort => {
    let onQuery: (questions: MdnsQuestion[]) => void = () => undefined;
    let onRecords: (records: MdnsRecord[], from: string) => void = () => undefined;
    let onError: (error: Error) => void = () => undefined;
    const fake: FakeMdns = {
      responses: [],
      queries: [],
      closed: false,
      ask: (questions) => onQuery(questions),
      hear: (records, from) => onRecords(records, from),
      fail: (error) => onError(error),
      port: {
        onQuery: (handler) => { onQuery = handler; },
        onRecords: (handler) => { onRecords = handler; },
        onError: (handler) => { onError = handler; },
        query: (name) => { fake.queries.push(name); },
        respond: (records) => { fake.responses.push(records); return Promise.resolve(); },
        close: () => { fake.closed = true; return Promise.resolve(); },
      },
    };
    mdnsPorts.push(fake);
    return fake.port;
  };

  const openUdp = (options: UdpOptions): Promise<UdpEndpoint> => {
    if (refuseUdp?.(options)) return Promise.reject(new Error('address in use'));
    const socket: FakeSocket = {
      options,
      sent: [],
      closed: false,
      deliver: (data, from) => options.onMessage?.(asBytes(data), from),
    };
    sockets.push(socket);
    return Promise.resolve({
      send: (data, port, address) => {
        socket.sent.push({ data, port, address });
        const reply = gateway?.(asBytes(data), port, address);
        if (reply) queueMicrotask(() => options.onMessage?.(reply, { address, port }));
      },
      close: () => { socket.closed = true; return Promise.resolve(); },
    });
  };

  const ports: NetworkPorts = { openMdns, openUdp, interfaces: () => interfaces };
  return {
    ports,
    sockets,
    mdnsPorts,
    mdns: (index = 0): FakeMdns => need(mdnsPorts[index]),
    socket: (index = 0): FakeSocket => need(sockets[index]),
  };
};

export type { GatewayReply };
export { createFakeNetwork };
