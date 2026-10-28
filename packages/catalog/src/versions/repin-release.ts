/* @layer core @kind logic */
import type { Repin, RepinParams, RepinWays } from './versions.type';

const repinRelease = async ({ list, pin }: RepinWays, { before, ...params }: RepinParams): Promise<Repin> => {
  const kept = await pin({ ...params, tag: before.tag }).catch(() => undefined);
  if (kept) return { pinned: kept };
  const { defaultId } = await list(params);
  const next = defaultId === undefined ? undefined : await pin({ ...params, tag: defaultId }).catch(() => undefined);
  if (!next) return {};
  return { pinned: next, note: `${params.entry.displayName} ${before.tag} does not fit Archipelago ${params.ap ?? 'the new engine'}, so ${next.release.tag} was installed instead.` };
};

export { repinRelease };
