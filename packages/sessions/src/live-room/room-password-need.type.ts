/* @layer core @kind types */
import type { LiveRoomPhase } from './live-room.type';

type PasswordNeed = 'none' | 'given' | 'missing';

type PasswordView = { sessionId: string | null; phase: LiveRoomPhase; passwordRequired: boolean };

export type { PasswordNeed, PasswordView };
