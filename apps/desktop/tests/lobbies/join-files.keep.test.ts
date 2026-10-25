/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { LobbyStarted } from '@drizztdourden08/archipelia-lobby-protocol';
import { followJoin } from '../../electron/joins/follow-join';
import { keepAlive } from '../../electron/joins/keep-alive';
import { fetchFiles } from '../../electron/joins/fetch-files';
import type { JoinRecord, JoinRun, LinkMessage, LobbyLink } from '../../electron/joins/joins.type';
import { MAX_FILE_BYTES } from '../../electron/joins/joins.constants';
import { tempFiles } from './temp-files';

type Served = { bytes: Uint8Array; size: number };

const cleanups: (() => Promise<unknown>)[] = [];

afterEach(async () => {
  vi.useRealTimers();
  for (const cleanup of cleanups.splice(0)) await cleanup();
});

const sha = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const record: JoinRecord = {
  id: 'j1', address: '127.0.0.1:38290', code: 'K7QM4XT2', displayName: 'Cy', slotName: 'Cy', game: 'Quest', state: 'approved', createdAt: 1, updatedAt: 1,
  yaml: { text: '', sha256: '', size: 0 },
};

const runWith = async (served: Record<string, Served>) => {
  const store = await tempFiles('joins');
  cleanups.push(store.remove);
  let current = record;
  const asked: string[] = [];
  const stream = (message: Record<string, unknown>, _isEnd: (part: LinkMessage) => boolean, accept: (part: LinkMessage) => boolean) => {
    const fileId = String(message.fileId);
    asked.push(fileId);
    const { bytes } = served[fileId] ?? { bytes: new Uint8Array() };
    const chunk: LinkMessage = { type: 'file.chunk', re: 1, fileId, offset: 0, data: Buffer.from(bytes).toString('base64') };
    if (!accept(chunk)) return Promise.reject(new Error('refused'));
    return Promise.resolve([chunk, { type: 'file.done', re: 1, fileId, sha256: sha(bytes) } satisfies LinkMessage]);
  };
  const link: LobbyLink = {
    stream, send: () => undefined, close: () => undefined, onClose: () => undefined, onMessage: () => () => undefined,
    request: () => Promise.reject(new Error('no request')), waitFor: () => Promise.reject(new Error('no wait')),
  };
  const run: JoinRun = {
    link, files: store.files, flags: { uploaded: true, readySent: true, fetching: false },
    current: () => current,
    save: (patch: Partial<JoinRecord>) => {
      current = { ...current, ...patch };
      return Promise.resolve(current);
    },
  };
  const started = (files: { id: string; name: string }[]): LobbyStarted => ({
    type: 'lobby.started', seed: '1', engine: { ap: '0.6.8' }, room: { address: 'h:1', host: 'h', port: 1, tls: 'no' },
    slots: [{ name: 'Cy', game: 'Quest', team: 0, files: files.map(({ id, name }) => ({ fileId: id, name, size: served[id]?.size ?? 0, sha256: '' })) }],
  });
  return { run, asked, started, results: () => current.results };
};

describe('the files a joined session sends', () => {
  test('saves a patch file, and refuses an unknown kind, an oversize file and a size that does not match', async () => {
    const good = new Uint8Array([1, 2, 3]);
    const { run, asked, started } = await runWith({
      f1: { bytes: good, size: 3 }, f2: { bytes: good, size: 3 }, f3: { bytes: good, size: MAX_FILE_BYTES + 1 }, f4: { bytes: good, size: 2 }, f5: { bytes: good, size: 9 },
    });
    const files = await fetchFiles(run, started([
      { id: 'f1', name: 'Cy.apquest' }, { id: 'f2', name: 'run.exe' }, { id: 'f3', name: 'big.zip' }, { id: 'f4', name: 'more.aplttp' }, { id: 'f5', name: 'less.aplttp' },
    ]));
    expect(files[0]?.saved).toContain('Cy.apquest');
    expect(files.slice(1).map((file) => file.refused)).toEqual([
      expect.stringContaining('only Archipelago patch'), expect.stringContaining('larger than'), expect.stringContaining('size'), expect.stringContaining('size'),
    ]);
    expect(asked).toEqual(['f1', 'f4', 'f5']);
  });

  test('fetches the files once when lobby.started comes again', async () => {
    const { run, asked, started, results } = await runWith({ f1: { bytes: new Uint8Array([7]), size: 1 } });
    const follow = followJoin(run);
    const message = started([{ id: 'f1', name: 'Cy.apquest' }]);
    follow(message);
    follow(message);
    await vi.waitFor(() => expect(results()?.files[0]?.saved).toBeTruthy());
    follow(message);
    await vi.waitFor(() => expect(results()?.files[0]?.saved).toBeTruthy());
    expect(asked).toEqual(['f1']);
  });
});

describe('the keepalive of a join', () => {
  test('pings while the server talks, and gives up on a silent server', () => {
    vi.useFakeTimers();
    let heard = 0;
    let now = 0;
    const ping = vi.fn();
    const onIdle = vi.fn();
    const stop = keepAlive({ ping, heardAt: () => heard }, { pingMs: 10, idleMs: 25 }, onIdle, () => now);
    now = 10;
    vi.advanceTimersByTime(10);
    expect(ping).toHaveBeenCalledTimes(1);
    heard = 10;
    now = 30;
    vi.advanceTimersByTime(10);
    expect(onIdle).not.toHaveBeenCalled();
    now = 60;
    vi.advanceTimersByTime(10);
    expect(onIdle).toHaveBeenCalledTimes(1);
    stop();
  });
});
