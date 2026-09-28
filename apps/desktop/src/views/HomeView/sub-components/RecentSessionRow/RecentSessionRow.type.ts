/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type RecentSessionRowProps = { session: Session; now: number; onOpen: (sessionId: string) => void };

export type { RecentSessionRowProps };
