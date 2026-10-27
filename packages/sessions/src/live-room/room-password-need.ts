/* @layer core @kind logic */
import type { PasswordNeed, PasswordView } from './room-password-need.type';

const roomPasswordNeed = (live: PasswordView, sessionId: string | null): PasswordNeed => {
  if (sessionId === null || live.sessionId !== sessionId) return 'none';
  if (live.phase === 'password') return 'missing';
  return live.passwordRequired ? 'given' : 'none';
};

export { roomPasswordNeed };
