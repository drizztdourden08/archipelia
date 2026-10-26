/* @layer core @kind logic */
import type { SourceWheelRequest } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { parseSourceRef } from '../source/parse-source-ref';
import { ASSET_NAME, TAG_NAME } from './wheel.constants';

const parseWheelRequest = (value: unknown): SourceWheelRequest => {
  const ref = parseSourceRef(value);
  const input: Record<string, unknown> = isRecord(value) ? value : {};
  const { tag, asset, typed } = input;
  if (typeof tag !== 'string' || !TAG_NAME.test(tag) || typeof asset !== 'string' || !ASSET_NAME.test(asset)) throw new Error('That package request is not valid.');
  return { ...ref, tag, asset, typed: typeof typed === 'string' ? typed.slice(0, 200) : undefined };
};

export { parseWheelRequest };
