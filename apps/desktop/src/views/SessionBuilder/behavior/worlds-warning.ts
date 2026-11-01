/* @layer renderer-app @kind logic */
import type { DirectWorld } from '../SessionBuilder.type';
import { DIRECT_TEXT } from './place.constants';

const worldsWarning = (worlds: readonly DirectWorld[], allowUnlisted: boolean): string | null =>
  (!allowUnlisted && worlds.some((world) => !world.listed) ? DIRECT_TEXT.worlds.unlisted : null);

export { worldsWarning };
