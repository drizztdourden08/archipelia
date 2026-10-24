/* @layer protocol @kind logic */
import type { Schema } from './validate.type';
import { isRecord } from './is-record';
import { REF_PREFIX } from './resolve-ref.constants';

const resolveRef = (root: Schema, ref: string): Schema => {
  if (!ref.startsWith(REF_PREFIX)) throw new Error(`unsupported $ref ${ref}`);
  let node: unknown = root;
  for (const key of ref.slice(REF_PREFIX.length).split('/')) {
    node = isRecord(node) ? node[key] : undefined;
  }
  if (!isRecord(node)) throw new Error(`$ref ${ref} points at nothing`);
  return node;
};

export { resolveRef };
