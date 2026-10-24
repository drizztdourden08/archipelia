/* @layer testing @kind logic */
import type { TransportEvent } from '../../node/transport/transport.type';
import type { PeerContext } from './play.type';

const typeOf = (text: string): string | null => {
  try {
    const value = JSON.parse(text) as { type?: unknown } | null;
    return typeof value?.type === 'string' ? value.type : null;
  } catch {
    return null;
  }
};

const skipped = (ctx: PeerContext, event: TransportEvent, wanted: string | null): boolean => {
  if (event.kind !== 'text') return false;
  const type = typeOf(event.text);
  return type !== null && type !== wanted && ctx.options.ignore.includes(type);
};

const nextEvent = async (ctx: PeerContext, wanted: string | null): Promise<TransportEvent> => {
  let event = await ctx.state.inbox.pull();
  while (skipped(ctx, event, wanted)) event = await ctx.state.inbox.pull();
  return event;
};

export { nextEvent };
