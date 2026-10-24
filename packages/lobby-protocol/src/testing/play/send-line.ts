/* @layer testing @kind logic */
import type { BinaryLine, MessageLine, RawLine } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { validateMessage } from '../../codec/validate-message';
import { resolveOutgoing } from './resolve-outgoing';
import { BINARY_SAMPLE } from './send-line.constants';
import { trackWelcome } from './track-welcome';

const sendLine = (ctx: PeerContext, line: MessageLine | RawLine | BinaryLine) => {
  const { transport } = ctx.state;
  if ('binary' in line) {
    transport.sendBinary(BINARY_SAMPLE);
    return;
  }
  if ('raw' in line) {
    transport.send(line.raw);
    return;
  }
  const message = resolveOutgoing(ctx, line.msg);
  const problems = line.invalid ? [] : validateMessage(line.dir, message);
  if (problems.length > 0) throw new Error(`the message to send breaks the schema: ${problems[0]?.message}`);
  trackWelcome(ctx, message);
  transport.send(JSON.stringify(message));
};

export { sendLine };
