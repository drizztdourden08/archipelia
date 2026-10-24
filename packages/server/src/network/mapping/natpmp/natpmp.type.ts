/* @layer core @kind types */
import type { MapProtocol, MappingPorts } from '../mapping.type';

type NatpmpFault = { ok: false; code: number };

type NatpmpAddress = { ok: true; address: string } | NatpmpFault;

type NatpmpMapping = { ok: true; internalPort: number; externalPort: number; lifetime: number } | NatpmpFault;

type NatpmpMappingRequest = {
  ports: MappingPorts;
  gateway: string;
  protocol: MapProtocol;
  port: number;
  externalPort: number;
  lifetime: number;
};

export type { NatpmpAddress, NatpmpMapping, NatpmpMappingRequest };
