/* @layer electron-main @kind logic */
import type { JoinStop } from './joins.type';

const isJoinStop = (error: unknown): error is JoinStop => error instanceof Error && 'state' in error && 'forget' in error;

export { isJoinStop };
