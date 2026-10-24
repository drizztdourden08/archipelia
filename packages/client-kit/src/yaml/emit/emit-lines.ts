/* @layer client-kit @kind logic */
import { createKitError } from '../../errors/create-kit-error';
import { INDENT, MAX_DEPTH } from './emit.constants';
import { entriesOf } from './entries-of';
import { formatScalar } from './format-scalar';
import { formatString } from './format-string';
import { inlineEmpty } from './inline-empty';
import { isBlock } from './is-block';
import { isPlainRecord } from './is-plain-record';

const emitItem = (item: unknown, depth: number): string[] => {
  const pad = INDENT.repeat(depth);
  if (!isBlock(item)) return [`${pad}- ${inlineEmpty(item) ?? formatScalar(item)}`];
  const [first = '', ...rest] = emitLines(item, depth + 1);
  return [`${pad}- ${first.trimStart()}`, ...rest];
};

const emitLines = (value: unknown, depth: number): string[] => {
  if (depth > MAX_DEPTH) throw createKitError('unsupported-value', `A value is nested deeper than ${MAX_DEPTH} levels.`);
  const pad = INDENT.repeat(depth);
  if (Array.isArray(value)) return value.flatMap((item: unknown) => emitItem(item, depth));
  if (isPlainRecord(value)) {
    return entriesOf(value).flatMap(([key, child]) => {
      const name = formatString(key);
      if (isBlock(child)) return [`${pad}${name}:`, ...emitLines(child, depth + 1)];
      return [`${pad}${name}: ${inlineEmpty(child) ?? formatScalar(child)}`];
    });
  }
  return [`${pad}${formatScalar(value)}`];
};

export { emitLines };
