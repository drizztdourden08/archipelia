/* @layer core @kind types */

type MdnsRecordBase = { name: string; ttl: number; flush: boolean };

type MdnsRecord =
  | (MdnsRecordBase & { type: 'PTR'; data: string })
  | (MdnsRecordBase & { type: 'SRV'; data: { port: number; target: string } })
  | (MdnsRecordBase & { type: 'TXT'; data: string[] })
  | (MdnsRecordBase & { type: 'A'; data: string });

type MdnsQuestion = { name: string; type: string };

type MdnsPort = {
  onQuery: (handler: (questions: MdnsQuestion[]) => void) => void;
  onRecords: (handler: (records: MdnsRecord[], from: string) => void) => void;
  onError: (handler: (error: Error) => void) => void;
  query: (name: string) => void;
  respond: (records: MdnsRecord[]) => Promise<void>;
  close: () => Promise<void>;
};

type UdpPeer = { address: string; port: number };

type UdpEndpoint = {
  send: (data: Uint8Array | string, port: number, address: string) => void;
  close: () => Promise<void>;
};

type UdpOptions = {
  port?: number;
  broadcast?: boolean;
  onMessage?: (data: Uint8Array, from: UdpPeer) => void;
  onError?: (error: Error) => void;
};

type LanInterface = { address: string; netmask: string };

type NetworkPorts = {
  openMdns: () => MdnsPort;
  openUdp: (options: UdpOptions) => Promise<UdpEndpoint>;
  interfaces: () => LanInterface[];
};

export type { LanInterface, MdnsPort, MdnsQuestion, MdnsRecord, NetworkPorts, UdpEndpoint, UdpOptions, UdpPeer };
