/* @layer core @kind logic */
import { KEY_JOIN } from './spoiler.constants';

const placementKey = (finder: string, location: string) => `${finder}${KEY_JOIN}${location}`;

export { placementKey };
