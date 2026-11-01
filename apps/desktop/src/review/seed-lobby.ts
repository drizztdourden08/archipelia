/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOBBY_STAGE, REVIEW_PORT } from './review.constants';
import { saveReviewTemplate } from './save-review-template';

const seedLobby = (): Promise<SessionTemplate | null> => saveReviewTemplate(LOBBY_STAGE.session, (base) => ({
  ...base,
  host: { kind: 'local', port: REVIEW_PORT + LOBBY_STAGE.portOffset },
  server: { ...base.server, hintCost: LOBBY_STAGE.hintCost, releaseMode: 'auto' },
  direct: { admission: 'host-approval', allowUnlisted: true },
  players: [...base.players.slice(0, 1), { slot: 2, name: LOBBY_STAGE.held, direct: true }],
}));

export { seedLobby };
