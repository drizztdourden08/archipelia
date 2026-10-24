/* @layer testing @kind logic */
import type { PeerContext } from './play.type';
import { nextEvent } from './next-event';

const expectClose = async (ctx: PeerContext, code: number): Promise<void> => {
  const event = await nextEvent(ctx, null);
  if (event.kind !== 'close') {
    throw new Error(`expected the connection to close with ${code}, got a ${event.kind} frame`);
  }
  if (event.code !== code) throw new Error(`expected the close code ${code}, got ${event.code}`);
};

export { expectClose };
