/* @layer core @kind logic */
import { createHash } from 'node:crypto';

const sha256Hex = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

export { sha256Hex };
