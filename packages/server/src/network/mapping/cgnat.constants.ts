/* @layer core @kind config */
import type { CgnatKind } from './mapping.type';

const CGNAT_RANGES: Array<{ kind: CgnatKind; base: string; prefix: number }> = [
  { kind: 'shared-range', base: '100.64.0.0', prefix: 10 },
  { kind: 'private-range', base: '10.0.0.0', prefix: 8 },
  { kind: 'private-range', base: '172.16.0.0', prefix: 12 },
  { kind: 'private-range', base: '192.168.0.0', prefix: 16 },
  { kind: 'private-range', base: '169.254.0.0', prefix: 16 },
];

const WHAT_TO_DO =
  'Archipelia has no relay. To host for players outside your network, use a public machine, open a port on the outer router, or join the players over a VPN.';

export { CGNAT_RANGES, WHAT_TO_DO };
