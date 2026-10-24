/* @layer protocol @kind logic */
import type { ProtocolMessage, UnknownMessage } from '../messages/message.type';
import { DEFAULT_LIMITS } from '../protocol/protocol.constants';
import { byteLength } from './byte-length';

const encodeMessage = (
  message: ProtocolMessage | UnknownMessage,
  maxBytes: number = DEFAULT_LIMITS.maxMessageBytes,
): string => {
  const text = JSON.stringify(message);
  const size = byteLength(text);
  if (size > maxBytes) throw new Error(`the ${message.type} message is ${size} bytes, the limit is ${maxBytes}`);
  return text;
};

export { encodeMessage };
