/* @layer testing @kind logic */
import type { BinaryLine, MessageLine, RawLine } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { PRE_WELCOME_MAX_MESSAGE_BYTES } from '../../protocol/protocol.constants';
import { decodeMessage } from '../../codec/decode-message';
import { matchMessage } from '../scenario/match-message';
import { nextEvent } from './next-event';
import { trackWelcome } from './track-welcome';

const compareRaw = (actual: string, expected: string): void => {
  if (actual !== expected) {
    throw new Error(`expected the text ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
};

const parseLoose = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error('the message is not JSON');
  }
};

const readMessage = (ctx: PeerContext, line: MessageLine, text: string): unknown => {
  if (line.invalid) return parseLoose(text);
  const early = ctx.options.role === 'server' && !ctx.state.welcomed;
  const maxBytes = early ? PRE_WELCOME_MAX_MESSAGE_BYTES : ctx.state.maxBytes;
  const decoded = decodeMessage(text, { direction: line.dir, maxBytes });
  if (!decoded.ok) throw new Error(`the message breaks the protocol: ${decoded.failure.message}`);
  return decoded.message;
};

const expectLine = async (ctx: PeerContext, line: MessageLine | RawLine | BinaryLine): Promise<void> => {
  const wanted = 'msg' in line && typeof line.msg.type === 'string' ? line.msg.type : null;
  const event = await nextEvent(ctx, wanted);
  if (event.kind === 'close') {
    throw new Error(`the connection closed with ${event.code} while waiting for ${wanted ?? 'a frame'}`);
  }
  if ('binary' in line) {
    if (event.kind !== 'binary') throw new Error('expected a binary frame');
    return;
  }
  if (event.kind !== 'text') throw new Error('expected a text frame');
  if ('raw' in line) {
    compareRaw(event.text, line.raw);
    return;
  }
  const message = readMessage(ctx, line, event.text);
  const mismatch = matchMessage(line.msg, message, ctx.bindings);
  if (mismatch !== null) throw new Error(mismatch);
  trackWelcome(ctx, message);
};

export { expectLine };
