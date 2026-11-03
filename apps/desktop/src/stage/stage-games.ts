/* @layer renderer-app @kind logic */
import type { LobbyStageGames } from '@archipelia/design';
import type { DirectConnection } from '@archipelia/model';
import { STAGE_GAMES_TEXT } from './stage.constants';

const stageGames = (direct: DirectConnection | undefined): LobbyStageGames | undefined => {
  if (!direct) return undefined;
  return { label: STAGE_GAMES_TEXT.label, values: direct.allowedGames.length > 0 ? direct.allowedGames : [STAGE_GAMES_TEXT.any] };
};

export { stageGames };
