/* @layer core @kind types */
import type { MapProtocol, MappingPorts } from '../mapping.type';

type PcpMapRequest = {
  clientAddress: string;
  nonce: Uint8Array;
  protocol: MapProtocol;
  internalPort: number;
  externalPort: number;
  lifetime: number;
};

type PcpFault = { ok: false; code: number };

type PcpMapping = { ok: true; externalPort: number; externalAddress: string | null; lifetime: number } | PcpFault;

type PcpMappingRequest = {
  ports: MappingPorts;
  gateways: string[] | null;
  nonce: Uint8Array;
  protocol: MapProtocol;
  port: number;
  externalPort: number;
  lifetime: number;
};

type PcpAnswer = { gateway: string; mapping: PcpMapping };

export type { PcpAnswer, PcpFault, PcpMapping, PcpMappingRequest, PcpMapRequest };
