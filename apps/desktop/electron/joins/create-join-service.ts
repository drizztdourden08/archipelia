/* @layer electron-main @kind logic */
import type { JoinView } from '../../src/joins/joins.type';
import { JOIN_TIMING, NOT_RESUMED, TEXT } from './joins.constants';
import type { JoinContext, JoinDeps, JoinRecord, LobbyLink } from './joins.type';
import { createJoinBook } from './create-join-book';
import { createRetries } from './create-retries';
import { joinView } from './join-view';
import { runJoin } from './run-join';

const newest = (left: JoinView, right: JoinView) => right.createdAt - left.createdAt;

const resumable = (record: JoinRecord) => Boolean(record.token && record.admission) && !NOT_RESUMED.includes(record.state);

const createJoinService = (deps: JoinDeps) => {
  const timing = { ...JOIN_TIMING, ...deps.timing };
  const retries = createRetries(timing, (id) => void resume(id).catch(() => undefined));
  const ctx: JoinContext = {
    deps, book: createJoinBook(deps.files), live: new Map<string, LobbyLink>(), now: deps.now ?? Date.now, timing, retry: retries.schedule, settled: retries.reset,
  };

  const require = async (id: string): Promise<JoinRecord> => {
    const record = await ctx.book.get(id);
    if (!record) throw new Error(TEXT.unknownJoin);
    return record;
  };

  const drop = (id: string) => {
    retries.cancel(id);
    const link = ctx.live.get(id);
    ctx.live.delete(id);
    link?.close();
  };

  const begin = async (record: JoinRecord) => {
    drop(record.id);
    await ctx.book.put(record);
    void runJoin(ctx, record).catch(() => undefined);
    return joinView(record);
  };

  const resume = async (id: string) => begin(await require(id));

  const forget = async (id: string, leave: boolean) => {
    if (leave) ctx.live.get(id)?.send({ type: 'leave' });
    drop(id);
    await ctx.book.remove(id);
  };

  return {
    list: async () => (await ctx.book.list()).map(joinView).sort(newest),
    start: begin,
    resume,
    leave: (id: string) => forget(id, true),
    dismiss: (id: string) => forget(id, false),
    resumeAll: async () => { await Promise.all((await ctx.book.list()).filter(resumable).map(begin)); },
    closeAll: () => [...ctx.live.keys(), ...retries.ids()].forEach(drop),
  };
};

export { createJoinService };
