/* @layer testing @kind logic */
import type { JsonValue } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { newToken } from '../../node/new-token';
import { WILDCARDS } from '../scenario/placeholder.constants';
import { sampleOf } from '../scenario/sample-of';

const lookupIn =
  (ctx: PeerContext) =>
  (name: string): JsonValue => {
    const bound = ctx.bindings[name];
    if (bound !== undefined) return bound;
    const wildcard = WILDCARDS[name];
    if (wildcard) return wildcard.sample;
    if (ctx.options.role !== 'server') throw new Error(`the placeholder $${name} has no value`);
    const made = name === 'token' ? newToken() : sampleOf(name);
    ctx.bindings[name] = made;
    return made;
  };

export { lookupIn };
