/* @layer electron-main @kind logic */
import { LIVE_STATES } from '../../src/joins/joins.constants';
import type { SocketTransport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import { IDLE_CLOSE_CODE, MS_PER_SECOND, TEXT } from './joins.constants';
import type { JoinContext, JoinRecord, JoinRun } from './joins.type';
import { checkLobby } from './check-lobby';
import { createLobbyLink } from './create-lobby-link';
import { followJoin } from './follow-join';
import { helloOf } from './hello-of';
import { joinStop } from './join-stop';
import { joinView } from './join-view';
import { keepAlive } from './keep-alive';
import { sendReady } from './send-ready';
import { stopPatch } from './stop-patch';
import { uploadFiles } from './upload-files';
import { uploadList } from './upload-list';

const runState = (ctx: JoinContext, first: JoinRecord) => {
  let record = first;
  const save = async (patch: Partial<JoinRecord>) => {
    record = { ...record, ...patch, updatedAt: ctx.now() };
    const saved = record;
    await ctx.book.put(saved);
    ctx.deps.emit(joinView(saved));
    return saved;
  };
  return { current: () => record, save };
};

const enter = async (ctx: JoinContext, run: JoinRun) => {
  const ap = await ctx.deps.engineAp();
  if (!ap) throw joinStop('failed', TEXT.noEngine);
  if (!run.current().token) await run.save(await checkLobby(run.link, run.current(), ctx.deps.client, ap));
  run.link.onMessage(followJoin(run));
  const welcome = await run.link.request(helloOf(run.current(), ctx.deps.client, ap));
  if (welcome.type === 'error') throw joinStop('failed', welcome.message);
  if (welcome.type !== 'welcome') throw joinStop('failed', TEXT.noReply);
  ctx.settled(run.current().id);
  await uploadFiles(run.link, welcome.need, uploadList(run.current(), ctx.deps), welcome.limits.chunkBytes);
  run.flags.uploaded = true;
  sendReady(run);
};

const lost = (ctx: JoinContext, id: string): Partial<JoinRecord> => ({ state: 'offline', message: TEXT.lost(Math.round(ctx.retry(id) / MS_PER_SECOND)) });

const watchClose = (ctx: JoinContext, run: JoinRun, stopKeepAlive: () => void) => {
  const { id } = run.current();
  run.link.onClose(() => {
    stopKeepAlive();
    if (ctx.live.get(id) !== run.link) return;
    ctx.live.delete(id);
    if (LIVE_STATES.includes(run.current().state)) void run.save(lost(ctx, id)).catch(() => undefined);
  });
};

const runJoin = async (ctx: JoinContext, first: JoinRecord) => {
  const { current, save } = runState(ctx, first);
  let transport: SocketTransport;
  try {
    await save({ state: 'connecting', message: undefined });
    transport = await ctx.deps.connect(first.address);
  } catch (error) {
    await save(first.token ? lost(ctx, first.id) : stopPatch(error));
    return;
  }
  const link = createLobbyLink(transport);
  const run: JoinRun = { link, files: ctx.deps.files, current, save, flags: { uploaded: false, readySent: false, fetching: false } };
  ctx.live.set(first.id, link);
  watchClose(ctx, run, keepAlive(transport, ctx.timing, () => transport.close(IDLE_CLOSE_CODE)));
  try {
    await enter(ctx, run);
  } catch (error) {
    if (LIVE_STATES.includes(current().state)) await save(stopPatch(error));
    link.close();
  }
};

export { runJoin };
