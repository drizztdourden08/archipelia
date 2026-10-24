/* @layer core @kind types */
import type { MappingPorts } from './mapping.type';

type UdpExchange = {
  ports: Pick<MappingPorts, 'openUdp' | 'retryDelaysMs'>;
  gateways: string[];
  payloadFor: (gateway: string) => Uint8Array | null;
  accept: (data: Uint8Array) => boolean;
};

type UdpAnswer = { data: Uint8Array; gateway: string };

export type { UdpAnswer, UdpExchange };
