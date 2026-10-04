/* @layer renderer-app @kind types */
import type { HostLogLine } from '@archipelia/hosts';
import type { Session } from '@archipelia/model';

type SessionView = { session: Session | null; lines: readonly HostLogLine[]; loaded: boolean; failed: boolean };

type SessionViewState = SessionView & { show: (view: SessionView) => void };

export type { SessionView, SessionViewState };
