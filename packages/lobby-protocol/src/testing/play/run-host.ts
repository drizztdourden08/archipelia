/* @layer testing @kind logic */
import type { HostLine } from '../scenario/scenario.type';
import type { PeerContext } from './play.type';
import { resolvePlaceholders } from '../scenario/resolve-placeholders';
import { lookupIn } from './lookup-in';

const runHost = async (ctx: PeerContext, line: HostLine): Promise<void> => {
  const { host } = ctx.options;
  if (!host) return;
  const resolved = resolvePlaceholders(line, lookupIn(ctx)) as HostLine;
  await host(resolved, ctx.bindings);
};

export { runHost };
