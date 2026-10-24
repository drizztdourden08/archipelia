/* @layer core @kind logic */
import { NATPMP_RESULTS } from './natpmp.constants';

const describeNatpmpFault = (code: number): string => NATPMP_RESULTS[code] ?? `the router answered with code ${code}`;

export { describeNatpmpFault };
