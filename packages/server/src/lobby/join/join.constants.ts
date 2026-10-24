/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const LOBBY_CLOSED: Failure = { code: 'lobby-closed', message: 'This lobby has ended.' };
const LOBBY_LOCKED: Failure = { code: 'lobby-locked', message: 'This lobby no longer takes new players.' };
const LOBBY_FULL: Failure = { code: 'lobby-full', message: 'This lobby has no free slots.' };
const SLOTS_FROZEN: Failure = { code: 'lobby-locked', message: 'The lobby is locked. Slots can no longer change.' };
const NO_SLOTS: Failure = { code: 'bad-message', message: 'A player needs at least one slot.', field: 'slots' };
const TAKEOVER_WAIT_MS = 2000;
const REPLACED: Failure = { code: 'resume-replaced', message: 'This player joined from another connection.' };

export { LOBBY_CLOSED, LOBBY_FULL, LOBBY_LOCKED, NO_SLOTS, REPLACED, SLOTS_FROZEN, TAKEOVER_WAIT_MS };
