/* @layer renderer-app @kind logic */
import { countsOf } from './counts-of';

const counterEntries = (value: unknown): [string, number][] => Object.entries(countsOf(value));

export { counterEntries };
