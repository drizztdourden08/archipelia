/* @layer core @kind types */
import type { createSessionService } from './session-service';

type SessionService = ReturnType<typeof createSessionService>;

export type { SessionService };
