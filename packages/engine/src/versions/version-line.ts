/* @layer core @kind logic */
import { versionParts } from './version-parts';

const versionLine = (version: string): string => versionParts(version).slice(0, 2).join('.');

export { versionLine };
