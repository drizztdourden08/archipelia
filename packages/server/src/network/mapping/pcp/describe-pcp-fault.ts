/* @layer core @kind logic */
import { PCP_RESULTS } from './pcp.constants';

const describePcpFault = (code: number): string => PCP_RESULTS[code] ?? `the router answered with code ${code}`;

export { describePcpFault };
