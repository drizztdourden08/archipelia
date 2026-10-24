/* @layer testing @kind logic */
import type { PeerContext } from './play.type';
import { isRecord } from '../../validate/is-record';

const track = (ctx: PeerContext, key: 'maxBytes' | 'chunkBytes', value: unknown) => {
  if (typeof value === 'number' && value > 0) ctx.state[key] = value;
};

const trackWelcome = (ctx: PeerContext, message: unknown) => {
  if (!isRecord(message) || message.type !== 'welcome') return;
  ctx.state.welcomed = true;
  if (!isRecord(message.limits)) return;
  track(ctx, 'maxBytes', message.limits.maxMessageBytes);
  track(ctx, 'chunkBytes', message.limits.chunkBytes);
};

export { trackWelcome };
