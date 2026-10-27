/* @layer renderer-app @kind logic */
import type { GameSource } from '@archipelia/model';
import { SECTION_OF_SOURCE } from '../GameStore.constants';
import type { GameSectionId } from '../GameStore.type';

const sectionOfSource = (source: GameSource): GameSectionId | null => SECTION_OF_SOURCE[source];

export { sectionOfSource };
