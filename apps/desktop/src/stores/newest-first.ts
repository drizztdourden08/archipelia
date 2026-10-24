/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';

const newestFirst = (a: AdminLobby, b: AdminLobby): number => b.createdAt - a.createdAt;

export { newestFirst };
