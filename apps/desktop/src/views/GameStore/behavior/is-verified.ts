/* @layer renderer-app @kind logic */
import type { GameRow } from '../GameStore.type';

const isVerified = ({ entry }: GameRow): boolean => entry.source === 'first-party' && entry.discovered === undefined;

export { isVerified };
