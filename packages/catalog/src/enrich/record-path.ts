/* @layer core @kind logic */
import { ENRICH_DIR } from './enrich.constants';

const recordPath = (apworld: string): string => `${ENRICH_DIR}/${apworld}.json`;

export { recordPath };
