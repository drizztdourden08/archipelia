/* @layer protocol @kind logic */
import { sha256Hex } from './sha256-hex';

const hashToken = (token: string): string => sha256Hex(token);

export { hashToken };
