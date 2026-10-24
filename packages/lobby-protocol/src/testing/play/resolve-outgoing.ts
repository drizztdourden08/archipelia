/* @layer testing @kind logic */
import type { JsonObject } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { placeholderName } from '../scenario/placeholder-name';
import { resolvePlaceholders } from '../scenario/resolve-placeholders';
import { unwrapHas } from '../scenario/unwrap-has';
import { chunkData } from './chunk-data';
import { lookupIn } from './lookup-in';

const withChunk = (ctx: PeerContext, msg: JsonObject, corrupt: boolean): JsonObject => {
  const lookup = lookupIn(ctx);
  const sha256 = resolvePlaceholders(msg.sha256 ?? null, lookup);
  const offset = resolvePlaceholders(msg.offset ?? null, lookup);
  if (typeof sha256 !== 'string' || typeof offset !== 'number') throw new Error('a chunk needs a hash and an offset');
  return { ...msg, data: chunkData({ files: ctx.options.files, sha256, offset, size: ctx.state.chunkBytes, corrupt }) };
};

const resolveOutgoing = (ctx: PeerContext, source: JsonObject): JsonObject => {
  const msg = unwrapHas(source) as JsonObject;
  const name = placeholderName(msg.data);
  const body = name === 'data' || name === 'bad_data' ? withChunk(ctx, msg, name === 'bad_data') : msg;
  return resolvePlaceholders(body, lookupIn(ctx)) as JsonObject;
};

export { resolveOutgoing };
