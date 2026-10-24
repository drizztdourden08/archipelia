/* @layer testing @kind logic */
import type { ScenarioResult } from '../scenario/scenario.type';
import type { PeerContext, PlayOptions } from './play.type';
import { createPeerState } from './create-peer-state';
import { playLine } from './play-line';
import { CLOSE_FAILED, CLOSE_NORMAL } from './play-script.constants';

const playScript = async (options: PlayOptions): Promise<ScenarioResult> => {
  const bindings = { ...options.values };
  let ctx: PeerContext | null = null;
  try {
    const transport = await options.io.open();
    ctx = { options, bindings, state: createPeerState(transport, options.timeoutMs) };
    for (const [index, line] of options.lines.entries()) await playLine(ctx, line, index);
    ctx.state.transport.close(CLOSE_NORMAL);
    return { ok: true, bindings };
  } catch (error) {
    ctx?.state.transport.close(CLOSE_FAILED);
    return { ok: false, failure: error instanceof Error ? error.message : String(error), bindings };
  }
};

export { playScript };
