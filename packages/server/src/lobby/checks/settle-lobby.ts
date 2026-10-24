/* @layer core @kind logic */
import { createError } from '@archipelia/lobby-protocol';
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { dismissMember } from '../member/dismiss-member';
import { checkSlot } from './check-slot';
import type { SlotJob, SlotVerdict, WorldVerdict } from './check-slot.type';
import { markArrived } from './mark-arrived';
import { setStates } from './set-states';

const jobsOf = (lobby: Lobby): SlotJob[] =>
  lobby.members.filter((member) => member.admission === 'approved').flatMap((member) =>
    member.slots.filter((slot) => slot.state === 'checking').map((slot) => ({ lobby, member, slot })));

const report = async (ctx: LobbyContext, lobbyId: string, verdicts: SlotVerdict[]) => {
  for (const { memberId, failure, fatal } of verdicts) {
    if (!failure) continue;
    const ref = { lobbyId, memberId };
    const message = createError(failure, { welcomed: true });
    if (fatal) await dismissMember(ctx, ref, { admission: 'refused', reason: failure.message, message: { ...message, fatal: true }, queued: true });
    else ctx.hub.send(ref, message);
  }
};

const settleOnce = async (ctx: LobbyContext, lobbyId: string) => {
  const marked = await markArrived(ctx, lobbyId);
  if (!marked) return;
  const jobs = jobsOf(marked);
  if (jobs.length === 0) return;
  const worlds = new Map<string, Promise<WorldVerdict>>();
  const verdicts = await Promise.all(jobs.map((job) => checkSlot(ctx, job, worlds)));
  let applied: SlotVerdict[] = [];
  const settled = await ctx.book.commit(lobbyId, (draft) => {
    applied = setStates(draft, verdicts);
  });
  await report(ctx, lobbyId, applied.filter((verdict) => !verdict.fatal));
  ctx.publish(settled);
  await report(ctx, lobbyId, applied.filter((verdict) => verdict.fatal));
};

const settleLobby = (ctx: LobbyContext, lobbyId: string) => ctx.queue(`settle:${lobbyId}`, () => settleOnce(ctx, lobbyId));

export { settleLobby };
