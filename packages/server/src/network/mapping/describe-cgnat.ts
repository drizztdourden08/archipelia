/* @layer core @kind logic */
import type { CgnatReport } from './mapping.type';
import { WHAT_TO_DO } from './cgnat.constants';

const describeCgnat = ({ kind, address, publicAddress }: CgnatReport): string => {
  if (kind === 'shared-range') {
    return `Your router's internet address (${address}) is shared by your provider with other customers (carrier-grade NAT), so players outside your network cannot reach you. ${WHAT_TO_DO}`;
  }
  if (kind === 'private-range') {
    return `Your router's internet address (${address}) is a private address, so another router sits between you and the internet and players outside cannot reach you. ${WHAT_TO_DO}`;
  }
  return `Your router reports ${address} but the internet sees you as ${publicAddress ?? 'another address'}, so your connection is shared (carrier-grade NAT) and players outside your network cannot reach you. ${WHAT_TO_DO}`;
};

export { describeCgnat };
