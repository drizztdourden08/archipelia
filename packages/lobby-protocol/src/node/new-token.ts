/* @layer protocol @kind logic */
import { randomBytes } from 'node:crypto';
import { TOKEN_BYTES } from './new-token.constants';

const newToken = (): string => randomBytes(TOKEN_BYTES).toString('base64url');

export { newToken };
