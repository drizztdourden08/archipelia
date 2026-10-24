/* @layer protocol @kind logic */
import type { ErrorMessage } from '../messages/server.type';
import type { Failure } from '../protocol/protocol.type';
import type { ErrorContext } from './codec.type';
import { ERROR_RULES } from '../protocol/error-rules.constants';

const createError = (failure: Failure, context: ErrorContext): ErrorMessage => {
  const rule = ERROR_RULES[failure.code];
  const fatal = rule.fatal === 'always' || (rule.fatal === 'before-welcome' && !context.welcomed);
  const message: ErrorMessage = { type: 'error', code: failure.code, message: failure.message, fatal };
  if (context.re !== undefined) message.re = context.re;
  if (failure.field !== undefined) message.field = failure.field;
  if (failure.slot !== undefined) message.slot = failure.slot;
  if (failure.retryAfter !== undefined) message.retryAfter = failure.retryAfter;
  if (failure.supported !== undefined) message.supported = failure.supported;
  if (failure.lobbyAp !== undefined) message.lobbyAp = failure.lobbyAp;
  return message;
};

export { createError };
