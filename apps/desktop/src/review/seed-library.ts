/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { REVIEW_GAME, REVIEW_PRESET, REVIEW_SESSION } from './review.constants';
import { reviewTemplate } from './review-template';

const seedLibrary = async (tour: AppReviewTour): Promise<SessionTemplate> => {
  const api = appApi();
  const installed = (await api.gamesList()).find((game) => game.apworld === REVIEW_GAME.apworld)
    ?? await api.gamesInstall({ kind: 'official', apworld: REVIEW_GAME.apworld });
  tour.check('game-installed', installed.game === REVIEW_GAME.game, `${installed.game} ${installed.version} is installed`, `${REVIEW_GAME.apworld} installed as ${installed.game}`);
  const preset = (await api.presetsList()).find((entry) => entry.name === REVIEW_PRESET && entry.game === installed.game)
    ?? await api.presetsCreate({ game: installed.game, name: REVIEW_PRESET });
  tour.check('preset-seeded', preset.id.length > 0, `the preset ${preset.name} exists for ${preset.game}`, 'the review preset was not created');
  const saved = (await api.templatesList()).find((entry) => entry.name === REVIEW_SESSION);
  const template = await api.templatesSave(reviewTemplate(preset, saved?.id));
  tour.check('session-seeded', template.players.length === 2, `the session ${template.name} has ${template.players.length} players`, 'the review session has no players');
  return template;
};

export { seedLibrary };
