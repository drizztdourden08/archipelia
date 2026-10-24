/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { createReviewHost } from '../lobbies/review/create-review-host';
import { playReviewClient } from '../lobbies/review/play-review-client';
import { REVIEW_FLAG } from '../lobbies/review/review.constants';

const lobbyReviewHandlers: HandlerGroup = {
  id: 'archipelia-lobby-review',
  register: (ctx) => {
    if (!ctx.flags.hasFlag(REVIEW_FLAG)) return;
    const review = createReviewHost((host) => ctx.emit(APP_CHANNELS.onLobbyReviewHost, host));
    ctx.handle(APP_CHANNELS.lobbyReviewPlay, async (_event, request) => {
      const { port } = ctx.services.lobbyServer.status();
      if (port === undefined) throw new Error('the lobby server is not listening');
      const { ok, failure } = await playReviewClient(request, port, review.hook);
      return failure === undefined ? { ok } : { ok, failure };
    });
    ctx.handle(APP_CHANNELS.lobbyReviewHostDone, (_event, id) => review.done(id));
  },
};

export { lobbyReviewHandlers };
