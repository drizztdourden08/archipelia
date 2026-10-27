/* @layer renderer-app @kind types */
import type { AdminLobby, Session, SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../live/live.type';

type TabDocumentsInput = {
  tabs: readonly LiveTab[];
  templates: readonly SessionTemplate[];
  lobbies: Record<string, AdminLobby[] | undefined>;
  runs: readonly Session[];
};

type SessionTabProps = { tab: LiveTab };

export type { SessionTabProps, TabDocumentsInput };
