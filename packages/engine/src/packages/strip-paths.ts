/* @layer core @kind logic */
import { ABSOLUTE_PATH } from './strip-paths.constants';

const lastSegment = (path: string) => path.split(/[\\/]/).filter(Boolean).at(-1) ?? '';

const stripPaths = (text: string): string => text.replace(ABSOLUTE_PATH, lastSegment);

export { stripPaths };
