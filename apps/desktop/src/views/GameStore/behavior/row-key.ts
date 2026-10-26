/* @layer renderer-app @kind logic */
import type { GameRow } from '../GameStore.type';

const rowKey = ({ entry }: GameRow): string => `${entry.source}:${entry.apworld}`;

export { rowKey };
