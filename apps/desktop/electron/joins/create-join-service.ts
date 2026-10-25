/* @layer electron-main @kind logic */
import type { JoinView } from '../../src/joins/joins.type';
import { RESUMABLE, TEXT } from './joins.constants';
import type { JoinContext, JoinDeps, JoinRecord, LobbyLink } from './joins.type';
import { createJoinBook } from './create-join-book';
import { joinView } from './join-view';
import { runJoin } from './run-join';

const newest = (left: JoinView, right: JoinView) => right.createdAt - left.createdAt;

const createJoinService = (deps: JoinDeps) => {
  const ctx: JoinContext = { deps, book: createJoinBook(deps.files), live: new Map<string, LobbyLink>(), now: deps.now ?? Date.now };

  const require = async (id: string): Promise<JoinRecord> => {
    const record = await ctx.book.get(id);
    if (!record) throw new Error(TEXT.unknownJoin);
    return record;
  };

  const drop = (id: string) => {
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

  const leave = async (id: string) => {
    const link = ctx.live.get(id);
    link?.send({ type: 'leave' });
    drop(id);
    await ctx.book.remove(id);
  };

  const resumeAll = async () => {
    const records = await ctx.book.list();
    await Promise.all(records.filter((record) => record.token && RESUMABLE.some((state) => state === record.state)).map(begin));
  };

  return {
    list: async () => (await ctx.book.list()).map(joinView).sort(newest),
    start: begin,
    resume: async (id: string) => begin(await require(id)),
    leave,
    dismiss: async (id: string) => {
      drop(id);
      await ctx.book.remove(id);
    },
    resumeAll,
    closeAll: () => [...ctx.live.keys()].forEach(drop),
  };
};

export { createJoinService };
