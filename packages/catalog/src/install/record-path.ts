/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { JSON_EXT } from './game-records.constants';

const recordPath = (apworld: string) => `${assertSafeName(apworld, 'apworld')}${JSON_EXT}`;

export { recordPath };
