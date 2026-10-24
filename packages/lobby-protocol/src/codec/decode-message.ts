/* @layer protocol @kind logic */
import type { ProtocolMessage, UnknownMessage } from '../messages/message.type';
import type { Failure } from '../protocol/protocol.type';
import type { DecodeOptions, DecodeOutcome } from './codec.type';
import { LOBBY_INFO_MAX_REQUEST_BYTES } from '../protocol/protocol.constants';
import { isRecord } from '../validate/is-record';
import { byteLength } from './byte-length';
import { schemaFor } from './message-types';
import { validateMessage } from './validate-message';

const bad = (message: string, field?: string): DecodeOutcome => {
  const failure: Failure = { code: 'bad-message', message };
  if (field !== undefined) failure.field = field;
  return { ok: false, failure };
};

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const infoTooBig = (type: string, size: number): string | null =>
  type === 'lobby.info' && size > LOBBY_INFO_MAX_REQUEST_BYTES
    ? `A lobby.info request is at most ${LOBBY_INFO_MAX_REQUEST_BYTES} bytes.`
    : null;

const shapeFailure = (message: Record<string, unknown>, direction: DecodeOptions['direction']): DecodeOutcome => {
  const first = validateMessage(direction, message)[0];
  const type = String(message.type);
  if (first === undefined) return { ok: true, known: true, message: message as ProtocolMessage };
  if (type === 'hello') {
    return { ok: false, failure: { code: 'metadata-missing', message: first.message, field: first.path } };
  }
  return bad(first.message, first.path);
};

const decodeMessage = (text: string, options: DecodeOptions): DecodeOutcome => {
  const size = byteLength(text);
  if (size > options.maxBytes) return bad(`The message is ${size} bytes. The limit is ${options.maxBytes}.`);
  const value = parseJson(text);
  if (!isRecord(value)) return bad('The message is not a JSON object.');
  if (typeof value.type !== 'string') return bad('The message has no type.', 'type');
  const tooBig = infoTooBig(value.type, size);
  if (tooBig !== null) return bad(tooBig);
  if (schemaFor(options.direction, value.type) === null) {
    if (options.direction === 'c2s') return bad(`The type ${value.type} is not known.`, 'type');
    return { ok: true, known: false, message: value as UnknownMessage };
  }
  return shapeFailure(value, options.direction);
};

export { decodeMessage };
