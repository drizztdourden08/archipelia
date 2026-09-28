/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { GAMES_DIR, JSON_EXT } from './game-records.constants';

const recordPath = (apworld: string) => `${GAMES_DIR}/${assertSafeName(apworld, 'apworld')}${JSON_EXT}`;

export { recordPath };
