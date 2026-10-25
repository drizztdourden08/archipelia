/* @layer electron-main @kind logic */
import type { LinkMessage } from './joins.type';

const replyTo = (message: LinkMessage): number | undefined => ('re' in message ? message.re : undefined);

export { replyTo };
