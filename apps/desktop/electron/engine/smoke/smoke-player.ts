/* @layer electron-main @kind logic */
import { SMOKE_PLAYER } from './smoke.constants';

const smokePlayer = (game: string): string => [
  `name: ${SMOKE_PLAYER}`,
  `game: ${JSON.stringify(game)}`,
  `${JSON.stringify(game)}: {}`,
  '',
].join('\n');

export { smokePlayer };
