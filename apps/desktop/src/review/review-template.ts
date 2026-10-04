/* @layer renderer-app @kind logic */
import type { GamePreset, SessionTemplate } from '@archipelia/model';
import { newTemplate } from '../views/SessionBuilder/behavior/new-template';
import { REVIEW_PLAYERS, REVIEW_PORT, REVIEW_SESSION } from './review.constants';

const reviewTemplate = (preset: GamePreset, id?: string): SessionTemplate => {
  const base = newTemplate(id);
  return {
    ...base,
    name: REVIEW_SESSION,
    host: { kind: 'local', port: REVIEW_PORT },
    server: { ...base.server, hintCost: 0 },
    players: REVIEW_PLAYERS.map((name, index) => ({
      slot: index + 1, name, game: preset.game, source: { kind: 'preset', presetId: preset.id, overrides: {} },
    })),
  };
};

export { reviewTemplate };
