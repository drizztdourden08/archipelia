/* @layer client-kit @kind logic */
import { createKitError } from '../../errors/create-kit-error';
import { LONE_SURROGATE, NEEDS_ESCAPE, PLAIN, RESERVED, SHORT_ESCAPES } from './emit.constants';

const escapeChar = (char: string): string =>
  SHORT_ESCAPES[char] ?? `\\u${(char.codePointAt(0) ?? 0).toString(16).padStart(4, '0')}`;

const needsQuotes = (text: string): boolean => text !== text.trim() || RESERVED.test(text) || !PLAIN.test(text);

const formatString = (text: string): string => {
  if (LONE_SURROGATE.test(text)) {
    throw createKitError('unsupported-value', 'A text holds half of a Unicode pair and cannot be written.');
  }
  if (!needsQuotes(text)) return text;
  return `"${text.replace(NEEDS_ESCAPE, escapeChar)}"`;
};

export { formatString };
