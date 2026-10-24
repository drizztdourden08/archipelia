/* @layer core @kind logic */
import type { CgnatReport } from './mapping.type';
import { inIpv4Range } from '../address/in-ipv4-range';
import { CGNAT_RANGES } from './cgnat.constants';

const assessCgnat = (address: string | null, publicAddress: string | null): CgnatReport | null => {
  if (address === null) return null;
  const range = CGNAT_RANGES.find(({ base, prefix }) => inIpv4Range(address, base, prefix));
  if (range) return { kind: range.kind, address, publicAddress };
  if (publicAddress !== null && publicAddress !== address) return { kind: 'public-mismatch', address, publicAddress };
  return null;
};

export { assessCgnat };
