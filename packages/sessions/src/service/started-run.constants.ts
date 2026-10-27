/* @layer core @kind config */
import { UNKNOWN_SOURCE_NAME } from '@archipelia/model';
import type { RunSource } from '@archipelia/model';

const UNKNOWN_SOURCE: RunSource = { sessionName: UNKNOWN_SOURCE_NAME, overrides: [], match: 'unknown' };

export { UNKNOWN_SOURCE };
