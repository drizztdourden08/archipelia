/* @layer testing @kind logic */
import type { FixtureLine } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { createPeerState } from './create-peer-state';
import { expectClose } from './expect-close';
import { expectLine } from './expect-line';
import { runHost } from './run-host';
import { sendLine } from './send-line';

const owns = (ctx: PeerContext, dir: 'c2s' | 's2c'): boolean => (ctx.options.role === 'client') === (dir === 'c2s');

const reconnect = async (ctx: PeerContext): Promise<void> => {
  const transport = await ctx.options.io.reopen(ctx.state.transport);
  ctx.state = createPeerState(transport, ctx.options.timeoutMs);
};

const dispatch = async (ctx: PeerContext, line: FixtureLine, index: number): Promise<void> => {
  switch (line.dir) {
    case 'c2s':
    case 's2c':
      if (owns(ctx, line.dir)) sendLine(ctx, line);
      else await expectLine(ctx, line);
      return;
    case 'close':
      if (ctx.options.role === 'server') ctx.state.transport.close(line.code);
      else await expectClose(ctx, line.code);
      return;
    case 'connect':
      if (index > 0) await reconnect(ctx);
      return;
    case 'host':
      if (ctx.options.role === 'client') await runHost(ctx, line);
      break;
  }
};

const playLine = async (ctx: PeerContext, line: FixtureLine, index: number): Promise<void> => {
  try {
    await dispatch(ctx, line, index);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`line ${index + 1} (${line.dir}): ${reason}`, { cause: error });
  }
};

export { playLine };
