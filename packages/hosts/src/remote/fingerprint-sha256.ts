/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { PREFIX } from './host-key.constants';

const fingerprintSha256 = (key: Buffer) => `${PREFIX}${createHash('sha256').update(key).digest('base64').replace(/=+$/, '')}`;

export { fingerprintSha256 };
