/* @layer electron-main @kind logic */
import type { JoinState } from '../../src/joins/joins.type';
import type { JoinStop } from './joins.type';

const joinStop = (state: JoinState, message: string, forget = false): JoinStop => Object.assign(new Error(message), { state, forget });

export { joinStop };
