/* @layer client-kit @kind logic */
import { createHash } from 'node:crypto';

const sha256Hex = (data: Uint8Array | string): string => createHash('sha256').update(data).digest('hex');

export { sha256Hex };
