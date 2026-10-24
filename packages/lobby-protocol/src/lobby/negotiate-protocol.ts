/* @layer protocol @kind logic */
import type { Negotiation } from './negotiate-protocol.type';
import { SUPPORTED_PROTOCOL_VERSIONS } from '../protocol/protocol.constants';

const negotiateProtocol = (offered: number[]): Negotiation => {
  const common = offered.filter((version) => SUPPORTED_PROTOCOL_VERSIONS.includes(version));
  if (common.length > 0) return { ok: true, version: Math.max(...common) };
  return {
    ok: false,
    failure: {
      code: 'protocol-unsupported',
      message: `This server speaks protocol ${SUPPORTED_PROTOCOL_VERSIONS.join(', ')}. The client offered ${offered.join(', ')}.`,
      supported: [...SUPPORTED_PROTOCOL_VERSIONS],
    },
  };
};

export { negotiateProtocol };
